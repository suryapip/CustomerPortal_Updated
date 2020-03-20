using MailKit;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using ScentAir.Payment;
using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using System.Transactions;

namespace ScentAir.Payment.Impl
{
    public class AccountManager : IAccountManager
    {
        private readonly PortalDbContext portalContext;
        private readonly X3DbContext x3Context;
        private readonly ILogger<AccountManager> logger;
        private readonly ChaseConfig chaseConfig;
        private readonly SmtpConfig smtpConfig;
        private readonly bool pinOverride;
        private readonly string testpin;
        private readonly bool paymentMethodAutoSelectOnChange;

        public AccountManager(
            PortalDbContext portalContext,
            X3DbContext x3Context,
            IConfiguration configuration,
            IOptions<ChaseConfig> chaseConfig,
            ILoggerFactory loggerFactory,
            IHttpContextAccessor httpAccessor, IOptions<SmtpConfig> smtpConfig)
        {
            this.portalContext = portalContext;
            this.x3Context = x3Context;
            this.logger = loggerFactory.CreateLogger<AccountManager>();
            this.chaseConfig = chaseConfig.Value; //configuration.Get<ChaseConfig>();
            this.smtpConfig = smtpConfig.Value;

            bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Options.EnablePaymentMethodAutoSelectOnChange), out paymentMethodAutoSelectOnChange);
            bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Options.OverridePin), out pinOverride);
            testpin = configuration.GetValue<string>(Constants.Configuration.Test.Pin);

            if (this.portalContext.Identity == null)
                if (httpAccessor != null)
                    this.portalContext.Identity = httpAccessor.HttpContext?.User?.Identity as ClaimsIdentity;
                else
                    this.portalContext.Identity = System.Security.Principal.WindowsIdentity.GetCurrent();
        }
        public AccountManager(
            PortalDbContext portalContext,
            X3DbContext x3Context,
            IConfiguration configuration,
            IOptions<ChaseConfig> chaseConfig,
            ILoggerFactory loggerFactory, IOptions<SmtpConfig> smtpConfig) : this(portalContext, x3Context, configuration, chaseConfig, loggerFactory, null, smtpConfig)
        {
        }


        public async Task<IList<Invoice>> GetInvoicesAsync(string accountNumber, bool open = true, bool closed = false, bool full = false, CancellationToken cancellationToken = default(CancellationToken))
        {
            var openStatuses = (int)(InvoiceStatus.Due | InvoiceStatus.Overdue | InvoiceStatus.PaidInPart);
            var closedStatuses = (int)InvoiceStatus.PaidInFull;

            var qry = portalContext.Invoices
                .Where(u => u.BilledToAccount.Number == accountNumber)
                .Where(u => (open && (((int)u.Status) & openStatuses) > 0) ||
                            (closed && (((int)u.Status) & closedStatuses) > 0 || u.Balance > 0));


            if (full)
                qry = qry
                    .Include(u => u.ShippingAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.ShippingAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.ShippingAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.ShippingAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.ShippingAddress);

            qry = qry
                .Include(u => u.Details)
                .Include(u => u.Payments);

            var data = await qry
                .ToListAsync(cancellationToken)
                .CatchDbAsync(logger);


            try
            {

                data.OrEmpty()
                    .ForEach(i => portalContext.Entry(i).State = EntityState.Detached);
            }
            catch
            {
            }


            // update the pending balance until the reimport occurs from x3
            // the import should update pending balance and update the payment history?? not safe
            // TODO import mark pending to Paid or Finalized???
            data.OrEmpty()
                .ForEach(i =>
                {
                    i.PendingBalance = i
                        .Payments
                        .Where(p => p.Status == InvoicePaymentStatus.Pending || p.Status == InvoicePaymentStatus.Processed)
                        .Sum(p => p.Amount);

                    i.Balance -= i.PendingBalance;
                });


            var result = data
                .Where(u => (open && u.Balance > 0) ||
                            (closed && u.Balance == 0))
                .ToArray();


            return result;
        }
        public async Task<Invoice> GetInvoiceAsync(string accountNumber, string InvoiceNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var qry = portalContext.Invoices
                .Where(u => u.BilledToAccount.Number == accountNumber)
                .Where(u => u.InvoiceNumber == InvoiceNumber)
                .Include(u => u.ShippingAddress)
                .Include(u => u.Details)
                .Include(u => u.Payments)
                .Include(u => u.Taxes)
                .Include(u => u.SellingEntity).ThenInclude(x => x.BillingAddress)
                .Include(u => u.SellingEntity).ThenInclude(x => x.MailingAddress)
                .Include(u => u.SellingEntity).ThenInclude(x => x.PhysicalAddress)
                .Include(u => u.SellingEntity).ThenInclude(x => x.ShippingAddress)
                .Include(u => u.BillingEntity).ThenInclude(x => x.BillingAddress)
                .Include(u => u.BillingEntity).ThenInclude(x => x.MailingAddress)
                .Include(u => u.BillingEntity).ThenInclude(x => x.PhysicalAddress)
                .Include(u => u.BillingEntity).ThenInclude(x => x.ShippingAddress)
                .Include(u => u.BilledToAccount).ThenInclude(x => x.BillingAddress)
                .Include(u => u.BilledToAccount).ThenInclude(x => x.MailingAddress)
                .Include(u => u.BilledToAccount).ThenInclude(x => x.PhysicalAddress)
                .Include(u => u.BilledToAccount).ThenInclude(x => x.ShippingAddress)
                .Include(u => u.SoldToAccount).ThenInclude(x => x.BillingAddress)
                .Include(u => u.SoldToAccount).ThenInclude(x => x.MailingAddress)
                .Include(u => u.SoldToAccount).ThenInclude(x => x.PhysicalAddress)
                .Include(u => u.SoldToAccount).ThenInclude(x => x.ShippingAddress);

            var data = await qry
                .SingleOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);


            if (data != null)
            {
                data.PendingBalance = data
                    .Payments
                    .Where(p => p.Status == InvoicePaymentStatus.Pending || p.Status == InvoicePaymentStatus.Processed)
                    .Sum(p => p.Amount);

                data.Balance -= data.PendingBalance;
            };



            return data;
        }

        /// <summary>
        /// Populate Company Ach , Wire details 
        /// </summary>
        /// <param name="companyNumber"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<CompanyWireAchDetail> GetCompanyAchWireDetailsAsync(string InvoiceNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var qry = portalContext.CompanyWireAchDetails
                .Where(u => u.InvoiceNumber == InvoiceNumber);

            var data = await qry
                .SingleOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);

            return data;
        }

        /// <summary>
        /// Fetch Invoice Header additional information
        /// </summary>
        /// <param name="accountNumber"></param>
        /// <param name="InvoiceNumber"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<InvoiceHeaderExtension> GetInvoiceHeaderAdditionalAsync(string accountNumber, string InvoiceNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var qry = portalContext.InvoiceHeaderExtensions
                .Include(u => u.PayByAddress)
                .Include(u => u.BillToAddress)
                .Include(u => u.ShipToAddress)
                .Include(u => u.RemitAddress)
                .Where(u => u.InvoiceNumber == InvoiceNumber)
                .Where(u => u.Invoice.BilledToAccount.Number == accountNumber);

            var data = await qry
                .SingleOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);

            return data;
        }


        public async Task<PaymentMethod> UnenrollAutoPay(string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {

            var methods = await GetPaymentMethodsAsync(accountNumber, cancellationToken);
            if (methods.OrEmpty().Count == 0)
                return null;

            var method = methods.FirstOrDefault(x => x.IsAuto == true);
            if (method == null)
                return null;

            method.IsDefault = true;

            var validAfter = DateTimeOffset.UtcNow.Part(DatePart.Year | DatePart.Month).AddDays(-1);

            var count = await portalContext.SaveChangesAsync(cancellationToken).CatchDbAsync(-1, logger);

            return method;
        }

        public async Task<bool> SetPaymentMethodToCurrent(string accountNumber, Guid id, bool currentAutoPayMethod = true, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = false;

            //var invoices = portalContext.Invoices
            //		.Where(p => (p.Status != InvoiceStatus.PaidInFull && p.Status != InvoiceStatus.PaymentPending) && p.BilledToAccountNumber == accountNumber);

            //if (invoices.Count() != 0)
            //	return result;

            var methods = await GetPaymentMethodsAsync(accountNumber, cancellationToken);
            if (methods.OrEmpty().Count == 0)
                return result;

            var method = methods.FirstOrDefault(x => x.Id == id);
            if (method == null)
                return result;



            var validAfter = DateTimeOffset.UtcNow.Part(DatePart.Year | DatePart.Month).AddDays(-1);


            if (currentAutoPayMethod)
            {
                if (method.ExpiresOn.HasValue && method.ExpiresOn <= validAfter)
                    throw new PortalException(PortalExceptionType.CreditCard_Expired)
                    {
                        { "ExpirationDate", method.ExpiresOn }
                    };

                method.IsAcceptedAutoTC = true;
                method.IsAuto = true;

                var currentAuth = await portalContext
                    .PaymentMethods
                    .Where(m => m.AccountNumber == accountNumber
                             && m.Id != id
                             && m.IsAuto
                             && !m.IsDeleted)
                    .FirstOrDefaultAsync(cancellationToken);

                if (currentAuth != null)
                    currentAuth.IsAuto = false;
            }
            else
            {
                method.IsAuto = false;

                if (paymentMethodAutoSelectOnChange)
                {
                    var others = await portalContext
                      .PaymentMethods
                      .Where(m => m.AccountNumber == accountNumber &&
                                  m.Id != id &&
                                  m.ExpiresOn.HasValue &&
                                  !m.IsDeleted &&
                                  !m.IsDisabled &&
                                  !m.IsAuto)
                      .OrderBy(m => m.IsDefault ? 1 : 0
                                  + m.PaymentType == method.PaymentType ? 2 : 0)
                      .ThenBy(m => m.ExpiresOn)
                      .ToArrayAsync(cancellationToken);

                    var next = others
                        .Where(m => m.ExpiresOn <= validAfter)
                        .FirstOrDefault();

                    if (next != null)
                        next.IsAuto = true;
                }
            }


            var count = await portalContext.SaveChangesAsync(cancellationToken).CatchDbAsync(-1, logger);

            result = count > 0;

            return result;
        }
        public async Task<IList<PaymentMethod>> GetPaymentMethodsAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var data = await portalContext.PaymentMethods
                .Where(m => m.AccountNumber == accountNumber && !m.IsDeleted)
                .Include(m => m.PaymentBillingAddress)
                .Include(m => m.Account)
                .ToArrayAsync(cancellationToken)
                .CatchDbAsync(logger);

            return data;
        }
        public async Task<PaymentMethod> GetPaymentMethodAsync(string accountNumber, string name, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await portalContext.PaymentMethods
                .Where(m => !m.IsDeleted
                         && m.AccountNumber == accountNumber
                         && m.Name == name)
                .Include(m => m.PaymentBillingAddress)
                .Include(m => m.Account)
                .FirstOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);
        }
        public async Task<PaymentMethod> GetPaymentMethodAsync(string accountNumber, string paymentAccountNumber, string paymentRoutingNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await portalContext.PaymentMethods
                .Where(m => !m.IsDeleted
                         && m.AccountNumber == accountNumber
                         && m.PaymentAccountNumber == paymentAccountNumber
                         && m.PaymentRoutingNumber == paymentRoutingNumber)
                .Include(m => m.PaymentBillingAddress)
                .Include(m => m.Account)
                .FirstOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);
        }
        public async Task<PaymentMethod> GetPaymentMethodAsync(string accountNumber, Guid id, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await portalContext.PaymentMethods
                .Where(m => !m.IsDeleted
                         && m.AccountNumber == accountNumber
                         && m.Id == id)
                .Include(m => m.PaymentBillingAddress)
                .Include(m => m.Account)
                .FirstOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);
        }

        private async Task<ITaskResult> savePaymentProfileForChase(PaymentMethod method, MerchantAccount merchantAccount, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var client = new Chase.PaymentechGatewayClient(Chase.PaymentechGatewayClient.EndpointConfiguration.PaymentechGateway, chaseConfig.Gateway);

            var request = new Chase.ProfileAddElement
            {
                orbitalConnectionUsername = merchantAccount.Uid,
                orbitalConnectionPassword = merchantAccount.Pwd,
                merchantID = merchantAccount.MerchantId,
                bin = "000001",
                customerProfileOrderOverideInd = "NO",
                customerProfileFromOrderInd = "A",

                customerName = method.PaymentBillToName,
                customerAddress1 = method.PaymentBillingAddress.Line1,
                customerAddress2 = method.PaymentBillingAddress.Line2,
                customerCity = method.PaymentBillingAddress.Municipality,
                customerState = method.PaymentBillingAddress.StateOrProvince,
                customerZIP = method.PaymentBillingAddress.PostalCode,
                customerCountryCode = method.PaymentBillingAddress.Country ?? " ",
                //mitMsgType = "CTSO",             
            };

            if ((method.PaymentType & PaymentType.ECP) == PaymentType.ECP)
            {
                request.customerAccountType = "EC";
                request.ecpCheckRT = method.PaymentRoutingNumber;
                request.ecpCheckDDA = method.PaymentAccountNumber;
                request.ecpDelvMethod = (method.Currency == "USD")
                                      ? "B"
                                      : "A";
                request.ecpBankAcctType = (method.PaymentType & PaymentType.BusinessChecking) == PaymentType.BusinessChecking
                                        ? "X"
                                        : (method.PaymentType & PaymentType.Checking) == PaymentType.Checking
                                        ? "C"
                                        : "S";
            }
            else if ((method.PaymentType & PaymentType.CreditCard) == PaymentType.CreditCard)
            {
                request.ccAccountNum = method.PaymentAccountNumber;
                //request.mcSecureCodeAAV = method.CCV;

                //should be CC or DP or EC....etc
                request.customerAccountType = "CC"; //(method.PaymentType & PaymentType.CreditCard) == PaymentType.CreditCard
                                                    //							//? "DP"
                                                    //							//: "CC";

                if (method.ExpiresOn.HasValue)
                    request.ccExp = $"{method.ExpiresOn.Value.Year}{method.ExpiresOn.Value.Month.ToString().PadLeft(2, '0')}";  //format yyyymm
            }
            else
            {
                return result.Add(nameof(PaymentMethod), "Unknown payment type").Fail();
            }



            var chaseResult = await client.ProfileAddAsync(request).InvokeAsync(this.logger);
            if (chaseResult.IsFailure)
            {
                result.Add(chaseResult);

                return result.Fail();
            }

            var response = chaseResult.Result;

            result.Add(nameof(PaymentMethod), response.@return.procStatusMessage);

            method.Token = response.@return.customerRefNum;
            method.TokenSource = $"Chase(PaymentechGateway): \"{merchantAccount.MerchantId}\"";

            if (method.PaymentType != PaymentType.BusinessChecking && method.PaymentType != PaymentType.Checking && method.PaymentType != PaymentType.Savings)
                method.Branch = await testChaseForPCard(method, merchantAccount, method.Token);


            return response.@return.procStatus == "0" ? result.Success() : result.Fail();
        }




        private async Task<ITaskResult> updatePaymentProfileForChase(PaymentMethod method, MerchantAccount merchantAccount, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var client = new Chase.PaymentechGatewayClient(Chase.PaymentechGatewayClient.EndpointConfiguration.PaymentechGateway, chaseConfig.Gateway);

            var request = new Chase.ProfileChangeElement
            {
                orbitalConnectionUsername = merchantAccount.Uid,
                orbitalConnectionPassword = merchantAccount.Pwd,
                merchantID = merchantAccount.MerchantId,
                bin = "000001",
                customerProfileOrderOverideInd = "NO",
                //customerProfileFromOrderInd = "A",

                customerName = method.PaymentBillToName,
                customerAddress1 = method.PaymentBillingAddress.Line1,
                customerAddress2 = method.PaymentBillingAddress.Line2,
                customerCity = method.PaymentBillingAddress.Municipality,
                customerState = method.PaymentBillingAddress.StateOrProvince,
                customerZIP = method.PaymentBillingAddress.PostalCode,
                customerRefNum = method.Token
            };

            if ((method.PaymentType & PaymentType.ECP) == PaymentType.ECP)
            {
                //request.customerAccountType = "EC";
                //request.ecpCheckRT = method.PaymentRoutingNumber;
                //request.ecpCheckDDA = method.PaymentAccountNumber;
                //request.ecpDelvMethod = (method.Currency == "USD")
                //                      ? "B"
                //                      : "A";
                //request.ecpBankAcctType = (method.PaymentType & PaymentType.BusinessChecking) == PaymentType.BusinessChecking
                //                        ? "X"
                //                        : (method.PaymentType & PaymentType.Checking) == PaymentType.Checking
                //                        ? "C"
                //                        : "S";
            }
            else if ((method.PaymentType & PaymentType.CreditCard) == PaymentType.CreditCard)
            {
                //request.mcSecureCodeAAV = method.CCV;

                //should be CC or DP or EC....etc
                request.customerAccountType = "CC"; //(method.PaymentType & PaymentType.CreditCard) == PaymentType.CreditCard
                                                    //							//? "DP"
                                                    //							//: "CC";

                if (method.ExpiresOn.HasValue)
                    request.ccExp = $"{method.ExpiresOn.Value.Year}{method.ExpiresOn.Value.Month.ToString().PadLeft(2, '0')}";  //format yyyymm
            }
            else
            {
                return result.Add(nameof(PaymentMethod), "Unknown payment type").Fail();
            }



            var chaseResult = await client.ProfileChangeAsync(request).InvokeAsync(this.logger);
            if (chaseResult.IsFailure)
            {
                result.Add(chaseResult);

                return result.Fail();
            }
            var response = chaseResult.Result;

            result.Add(nameof(PaymentMethod), response.@return.procStatusMessage);

            //method.Token = response.@return.customerRefNum;
            //method.TokenSource = $"Chase(PaymentechGateway): \"{merchantAccount.MerchantId}\"";

            return response.@return.procStatus == "0" ? result.Success() : result.Fail();
        }

        private async Task<ITaskResult> deletePaymentProfileFromChase(PaymentMethod method, MerchantAccount merchantAccount, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var client = new Chase.PaymentechGatewayClient(Chase.PaymentechGatewayClient.EndpointConfiguration.PaymentechGateway, chaseConfig.Gateway);

            var request = new Chase.ProfileDeleteElement
            {
                orbitalConnectionUsername = merchantAccount.Uid,
                orbitalConnectionPassword = merchantAccount.Pwd,
                merchantID = merchantAccount.MerchantId,
                bin = "000001",
                customerRefNum = method.Token
            };

            var chaseResult = await client.ProfileDeleteAsync(request).InvokeAsync(this.logger);
            if (chaseResult.IsFailure)
            {
                result.Add(chaseResult);

                return result.Fail();
            }
            var response = chaseResult.Result;

            result.Add(nameof(PaymentMethod), response.@return.procStatusMessage);

            //method.Token = response.@return.customerRefNum;
            //method.TokenSource = $"Chase(PaymentechGateway): \"{merchantAccount.MerchantId}\"";

            return response.@return.procStatus == "0" ? result.Success() : result.Fail();
        }

        private MerchantAccount determineMerchantAccountToUse(string currency)
        {
            var merchantAccount = currency == "USD"
                    ? chaseConfig.USD
                    : currency == "CAD"
                    ? chaseConfig.CAD
                    : null;

            return merchantAccount;
        }
        public async Task<ITaskResult<PaymentMethod>> SavePaymentMethod(PaymentMethod method, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbPaymentMethod = null as PaymentMethod;

            if (method == null)
                return method.AsFailure();



            var defaultBillingAddress = await portalContext.Accounts
                .Where(x => x.Number == method.AccountNumber)
                .Select(x => x.BillingAddress)
                .FirstOrDefaultAsync(cancellationToken);


            method.PaymentBillingAddress = method.PaymentBillingAddress ?? defaultBillingAddress;


            var billingAddress = await SaveAddressAsync(method.PaymentBillingAddress, null, cancellationToken);


            method.PaymentAccountNumber = method.PaymentAccountNumber.Replace(" ", "").Replace("-", "");

            var merchantAccount = determineMerchantAccountToUse((method.Currency ?? "USD").ToUpper());


            var dontSaveToChase = chaseConfig.Disabled || (merchantAccount?.Disabled ?? true);
            if (!dontSaveToChase && merchantAccount == null)
                throw new PortalException(PortalExceptionType.Chase_UnsupportedCurrency);

            if (!dontSaveToChase)
            {
                if ((method.Id == null || method.Id == Guid.Empty) && !method.IsDeleted)
                {
                    var result = await savePaymentProfileForChase(method, merchantAccount, cancellationToken);
                    if (!result.IsSuccessful)
                        return method.AsFailure().Add(result);
                }
                else if (!method.IsDeleted)
                {
                    var currMethod = await portalContext.PaymentMethods.FirstOrDefaultAsync(x => x.Id == method.Id);
                    method.Token = currMethod.Token;

                    var result = await updatePaymentProfileForChase(method, merchantAccount, cancellationToken);
                    if (!result.IsSuccessful)
                        return method.AsFailure().Add(result);
                }
                else if (method.IsDeleted)
                {
                    var currMethod = await portalContext.PaymentMethods.FirstOrDefaultAsync(x => x.Id == method.Id);
                    method.Token = currMethod.Token;

                    var result = await deletePaymentProfileFromChase(method, merchantAccount, cancellationToken);
                    if (!result.IsSuccessful)
                        return method.AsFailure().Add(result);
                }
            }





            var isBankAccount = (method.PaymentType & PaymentType.ECP) == PaymentType.ECP;


            var first = string.Join("", isBankAccount
                       ? method.PaymentAccountNumber.Take(2)
                       : method.PaymentAccountNumber.Take(4));

            var last = string.Join("", isBankAccount
                       ? method.PaymentAccountNumber.Reverse().Take(2).Reverse()
                       : method.PaymentAccountNumber.Reverse().Take(4).Reverse());

            var middle = string.Join("", isBankAccount
                       ? method.PaymentAccountNumber.Skip(2).Take(method.PaymentAccountNumber.Length - 4).Select(x => "X")
                       : method.PaymentAccountNumber.Skip(4).Take(method.PaymentAccountNumber.Length - 8).Select(x => "X"));

            var safeAccountNumber = $"{first}{middle}{last}";
            var safeCCV = string.Join("", method.CCV.Select(x => "X"));



            if (method.IsAuto)
            {
                // unset current isAuto if any not me
                var currentAuto = await portalContext.PaymentMethods
                    .Where(x => x.AccountNumber == method.AccountNumber
                             && x.Id != method.Id
                             && x.IsAuto
                             && !x.IsDeleted && !x.IsDisabled)
                    .FirstOrDefaultAsync();

                if (currentAuto != null)
                {
                    currentAuto.IsAuto = false;

                    await portalContext.SaveAsync(cancellationToken);
                }
            }


            dbPaymentMethod = await portalContext.PaymentMethods
                .Where(m => !m.IsDeleted &&
                            ((method.Id != Guid.Empty && method.Id == m.Id) ||
                             (m.AccountNumber == method.AccountNumber &&
                              (m.PaymentType == method.PaymentType &&
                               m.PaymentAccountNumber == method.PaymentAccountNumber) //||
                                                                                      //(m.Name == method.Name)
                              )
                             ))
                .Include(m => m.PaymentBillingAddress)
                .FirstOrDefaultAsync(cancellationToken);


            var ePaymentMethod = null as EntityEntry<PaymentMethod>;
            if (dbPaymentMethod == null)
            {
                ePaymentMethod = await portalContext.AddAsync(new PaymentMethod
                {
                    Name = method.Name,
                    AccountNumber = method.AccountNumber,
                    TokenSource = method.TokenSource,
                    Token = method.Token,
                    PaymentType = method.PaymentType,
                    PaymentBillToName = method.PaymentBillToName,
                    PaymentBillingAddress = billingAddress,
                    PaymentAccountNumber = safeAccountNumber,
                    PaymentRoutingNumber = method.PaymentRoutingNumber,
                    CCV = safeCCV,
                    ExpiresOn = method.ExpiresOn,
                    Bank = method.Bank,
                    Branch = method.Branch,
                    Currency = method.Currency,
                    IsDisabled = method.IsDisabled,
                    IsDefault = method.IsDefault,
                    IsAuto = method.IsAuto
                }, cancellationToken);
            }
            else
            {
                dbPaymentMethod.CopyNotEmpty(x => x.TokenSource, method);
                dbPaymentMethod.CopyNotEmpty(x => x.Token, method);
                dbPaymentMethod.CopyNotNull(x => x.PaymentType, method);
                dbPaymentMethod.CopyNotEmpty(x => x.PaymentBillToName, method);
                dbPaymentMethod.SetIf(x => x.PaymentBillingAddress, billingAddress, DataExtensions.AreDifferent);
                dbPaymentMethod.SetNotEmpty(x => x.PaymentAccountNumber, safeAccountNumber);
                dbPaymentMethod.CopyNotEmpty(x => x.PaymentRoutingNumber, method);
                dbPaymentMethod.SetNotEmpty(x => x.CCV, safeCCV);
                dbPaymentMethod.CopyNotNull(x => x.ExpiresOn, method);
                dbPaymentMethod.CopyNotEmpty(x => x.Bank, method);
                dbPaymentMethod.CopyNotEmpty(x => x.Branch, method);
                dbPaymentMethod.CopyNotEmpty(x => x.Currency, method);
                dbPaymentMethod.CopyNotNull(x => x.IsAuto, method);
                dbPaymentMethod.CopyNotNull(x => x.IsDeleted, method);
                dbPaymentMethod.CopyNotNull(x => x.IsDisabled, method);
                dbPaymentMethod.CopyNotNull(x => x.IsDefault, method);

                ePaymentMethod = portalContext.Update(dbPaymentMethod);
            }



            var count = await portalContext.SaveChangesAsync(cancellationToken).CatchDbAsync(-1, logger);

            dbPaymentMethod = ePaymentMethod.Entity;

            if (count < 0)
                return method.AsFailure().Add(nameof(PaymentMethod), "Error saving profile");

            //send email

            return dbPaymentMethod.AsSuccess();
        }

        public async Task<Company> GetCompanyByNameAsync(string name, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbCompany = await portalContext
                .Companies
                .Where(x => x.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
                .Include(x => x.PhysicalAddress)
                .Include(x => x.BillingAddress)
                .Include(x => x.MailingAddress)
                .Include(x => x.ShippingAddress)
                .FirstOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);

            return dbCompany;
        }
        public async Task<Company> GetCompanyAsync(string number, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbCompany = await portalContext
                .Companies
                .Where(x => x.Number == number)
                .Include(x => x.PhysicalAddress)
                .Include(x => x.BillingAddress)
                .Include(x => x.MailingAddress)
                .Include(x => x.ShippingAddress)
                .FirstOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);

            return dbCompany;
        }



        public async Task<Account> GetAccountAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (accountNumber.IsNullOrWhiteSpace())
                return null;
            if (accountNumber == "*")
                return new Account();

            var dbAccount = await portalContext
                .Accounts
                .Where(x => x.Number == accountNumber)
                .Include(x => x.PhysicalAddress)
                .Include(x => x.BillingAddress)
                .Include(x => x.MailingAddress)
                .Include(x => x.ShippingAddress)
                .FirstOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);

            return dbAccount;
        }
        public async Task<Address> SaveAddressAsync(Address address, Address original = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (address == null)
                return null;


            var expr = address.CreatePredicateExpression();

            original = original ?? await portalContext.Addresses.FirstOrDefaultAsync(expr, cancellationToken);


            var eAddress = null as EntityEntry<Address>;

            if (original == null)
            {
                eAddress = await portalContext.AddAsync(new Address
                {
                    Id = Guid.NewGuid(),

                    Line1 = address.Line1,
                    Line2 = address.Line2,
                    Line3 = address.Line3,
                    Municipality = address.Municipality,
                    StateOrProvince = address.StateOrProvince,
                    Country = address.Country ?? " ",
                    PostalCode = address.PostalCode
                }, cancellationToken);
            }
            else
            {
                original.CopyNotEmpty(x => x.Line1, address);
                original.CopyNotEmpty(x => x.Line2, address);
                original.CopyNotEmpty(x => x.Line3, address);
                original.CopyNotEmpty(x => x.Municipality, address);
                original.CopyNotEmpty(x => x.StateOrProvince, address);
                original.CopyNotEmpty(x => x.Country, address);
                original.CopyNotEmpty(x => x.PostalCode, address);

                eAddress = portalContext.Update(original);
            }

            await portalContext.SaveAsync(cancellationToken);

            original = eAddress.Entity;

            //portalContext.Entry(result).State = EntityState.Detached;

            return original;
        }
        public async Task<Account> SaveAccountAsync(Account account, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (account == null)
                return null;


            var dbAccount = await GetAccountAsync(account.Number, cancellationToken);

            Address physicalAddress = null;
            Address billingAddress = null;
            Address mailingAddress = null;
            Address shippingAddress = null;

            int isDirty = 0;
            var eAccount = null as EntityEntry<Account>;

            if (dbAccount != null)
            {
                if (dbAccount.PhysicalAddress == null)
                {
                    physicalAddress = await SaveAddressAsync(account.PhysicalAddress, null, cancellationToken) ?? dbAccount?.PhysicalAddress;
                    if (physicalAddress != null)
                    {
                        dbAccount.PhysicalAddress = physicalAddress;
                        isDirty = 1;
                    }
                }
                if (dbAccount.BillingAddress == null)
                {
                    billingAddress = await SaveAddressAsync(account.BillingAddress, null, cancellationToken) ?? dbAccount?.BillingAddress;
                    dbAccount.BillingAddress = billingAddress;
                    isDirty = 1;
                }
                if (dbAccount.MailingAddress == null)
                {
                    mailingAddress = await SaveAddressAsync(account.MailingAddress, null, cancellationToken) ?? dbAccount?.MailingAddress;
                    dbAccount.MailingAddress = mailingAddress;
                    isDirty = 1;
                }
                if (dbAccount.ShippingAddress == null)
                {
                    shippingAddress = await SaveAddressAsync(account.ShippingAddress, null, cancellationToken) ?? dbAccount?.ShippingAddress;
                    dbAccount.ShippingAddress = shippingAddress;
                    isDirty = 1;
                }

                // Author : Vinod Patil (PIP) , Purpose : Included Customer's Language and Tax fie
                dbAccount.Language = account?.Language;
                dbAccount.TaxId = account?.TaxId;
                dbAccount.TaxPrefix = account?.TaxPrefix;

                if (isDirty == 1)
                {
                    eAccount = portalContext.Update(dbAccount);

                    await portalContext.SaveAsync(cancellationToken);

                    dbAccount = eAccount.Entity;
                }
            }
            else
            {
                physicalAddress = await SaveAddressAsync(account.PhysicalAddress, null, cancellationToken) ?? dbAccount?.PhysicalAddress;
                billingAddress = await SaveAddressAsync(account.BillingAddress, null, cancellationToken) ?? dbAccount?.BillingAddress;
                mailingAddress = await SaveAddressAsync(account.MailingAddress, null, cancellationToken) ?? dbAccount?.MailingAddress;
                shippingAddress = await SaveAddressAsync(account.ShippingAddress, null, cancellationToken) ?? dbAccount?.ShippingAddress;
            }

            if (dbAccount != null)
                return dbAccount;


            if (dbAccount == null)
            {
                eAccount = await portalContext.AddAsync(new Account
                {
                    ExternalRowVersion = account.ExternalRowVersion,
                    Number = account.Number,
                    Pin = account.Pin,
                    Name = account.Name,

                    Email = account.Email,
                    PhoneNumber = account.PhoneNumber,
                    FaxNumber = account.FaxNumber,

                    Currency = account.Currency,
                    SalesPerson = account.SalesPerson,
                    AccountRepresentative = account.AccountRepresentative,

                    PhysicalAddress = physicalAddress,
                    MailingAddress = mailingAddress,
                    ShippingAddress = shippingAddress,
                    BillingAddress = billingAddress,
                    Language = account?.Language
                }, cancellationToken);

                await portalContext.SaveAsync(cancellationToken);

                dbAccount = eAccount.Entity;
            }
            else
            {
                if (account.ExternalRowVersion != dbAccount.ExternalRowVersion)
                {
                    dbAccount.CopyIf(x => x.ExternalRowVersion, account, DataExtensions.AreDifferent);
                    dbAccount.CopyNotEmpty(x => x.Number, account);
                    dbAccount.CopyNotEmpty(x => x.Pin, account);
                    dbAccount.CopyNotEmpty(x => x.Name, account);

                    dbAccount.CopyNotEmpty(x => x.Email, account);
                    dbAccount.CopyNotEmpty(x => x.PhoneNumber, account);
                    dbAccount.CopyNotEmpty(x => x.FaxNumber, account);

                    dbAccount.CopyNotEmpty(x => x.Currency, account);
                    dbAccount.CopyNotEmpty(x => x.SalesPerson, account);
                    dbAccount.CopyNotEmpty(x => x.AccountRepresentative, account);
                    dbAccount.CopyNotEmpty(x => x.Language, account);

                    dbAccount.SetIf(x => x.PhysicalAddress, physicalAddress, DataExtensions.AreDifferent);
                    dbAccount.SetIf(x => x.ShippingAddress, shippingAddress, DataExtensions.AreDifferent);
                    dbAccount.SetIf(x => x.BillingAddress, billingAddress, DataExtensions.AreDifferent);
                    dbAccount.SetIf(x => x.MailingAddress, mailingAddress, DataExtensions.AreDifferent);


                    eAccount = portalContext.Update(dbAccount);

                    await portalContext.SaveAsync(cancellationToken);

                    dbAccount = eAccount.Entity;
                }
            }



            //portalContext.Entry(dbAccount).State = EntityState.Detached;


            return dbAccount;
        }
        public async Task<Company> SaveCompanyAsync(Company company, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbCompany = await portalContext
                .Companies
                .Where(x => x.Name.ToLower() == company.Name.ToLower() && x.PhysicalAddress.Line1 == company.PhysicalAddress.Line1 && x.Currency == company.Currency && x.WireName == company.WireName && x.BillingAddress.Line1 == company.BillingAddress.Line1)
                .Include(x => x.PhysicalAddress)
                .Include(x => x.BillingAddress)
                .Include(x => x.MailingAddress)
                .Include(x => x.ShippingAddress)
                .FirstOrDefaultAsync(cancellationToken);

            var physicalAddress = await SaveAddressAsync(company.PhysicalAddress, dbCompany?.PhysicalAddress, cancellationToken);
            var billingAddress = await SaveAddressAsync(company.BillingAddress, dbCompany?.BillingAddress, cancellationToken);
            var mailingAddress = await SaveAddressAsync(company.MailingAddress, dbCompany?.MailingAddress, cancellationToken);
            var shippingAddress = await SaveAddressAsync(company.ShippingAddress, dbCompany?.ShippingAddress, cancellationToken);



            var eCompany = null as EntityEntry<Company>;
            if (dbCompany == null)
            {
                eCompany = await portalContext.AddAsync(new Company
                {
                    ExternalRowVersion = company.ExternalRowVersion,
                    Number = company.Number ?? string.Concat(company.Name, company.PhysicalAddress.Line1, company.Currency, company.WireName, company.BillingAddress.Line1).ToBytes().ToBase64String(13),
                    Name = company.Name,
                    Email = company.Email,
                    PhoneNumber = company.PhoneNumber,
                    FaxNumber = company.FaxNumber,

                    Currency = company.Currency,

                    WireRoutingNumber = company.WireRoutingNumber,
                    WireAccountNumber = company.WireAccountNumber,
                    WireBank = company.WireBank,
                    WireBranch = company.WireBranch,
                    WireName = company.WireName,

                    BillingAddress = billingAddress,
                    PhysicalAddress = physicalAddress,
                    MailingAddress = mailingAddress,
                    ShippingAddress = shippingAddress,
                    KvkNumber = company.KvkNumber,
                    TaxId = company.TaxId,
                    TaxIdPrefix = company.TaxIdPrefix
                }, cancellationToken);
            }
            else
            {
                dbCompany.CopyIf(x => x.ExternalRowVersion, company, DataExtensions.AreDifferent);
                dbCompany.CopyNotEmpty(x => x.Name, company);
                dbCompany.CopyNotEmpty(x => x.Email, company);
                dbCompany.CopyNotEmpty(x => x.PhoneNumber, company);
                dbCompany.CopyNotEmpty(x => x.FaxNumber, company);

                dbCompany.CopyNotEmpty(x => x.Currency, company);

                dbCompany.CopyNotEmpty(x => x.WireRoutingNumber, company);
                dbCompany.CopyNotEmpty(x => x.WireAccountNumber, company);
                dbCompany.CopyNotEmpty(x => x.WireBank, company);
                dbCompany.CopyNotEmpty(x => x.WireBranch, company);
                dbCompany.CopyNotEmpty(x => x.WireName, company);

                dbCompany.SetIf(x => x.PhysicalAddress, physicalAddress, DataExtensions.AreDifferent);
                dbCompany.SetIf(x => x.ShippingAddress, shippingAddress, DataExtensions.AreDifferent);
                dbCompany.SetIf(x => x.BillingAddress, billingAddress, DataExtensions.AreDifferent);
                dbCompany.SetIf(x => x.MailingAddress, mailingAddress, DataExtensions.AreDifferent);
                dbCompany.CopyNotEmpty(x => x.KvkNumber, company);
                dbCompany.CopyNotEmpty(x => x.TaxId, company);
                dbCompany.CopyNotEmpty(x => x.TaxIdPrefix, company);


                eCompany = portalContext.Update(dbCompany);
            }

            await portalContext.SaveAsync(cancellationToken);

            dbCompany = eCompany.Entity;

            portalContext.Entry(dbCompany).State = EntityState.Detached;


            return dbCompany;
        }

        /// <summary>
        /// Author : Vinod Patil (PIP) , Purpose : Save Company Wire, ACH information
        /// </summary>
        /// <param name="ObjCompanyWireAch"></param>
        /// <param name="objSellerCompany"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<CompanyWireAchDetail> SaveCompanyWireAchDetailsAsync(CompanyWireAchDetail ObjCompanyWireAch, Company objSellerCompany, CancellationToken cancellationToken = default(CancellationToken))
        {

            var dbCompanyWireAchDetails = await portalContext
                                        .CompanyWireAchDetails
                                        .Where(x => x.InvoiceNumber.ToLower() == ObjCompanyWireAch.InvoiceNumber.ToLower())
                                        .FirstOrDefaultAsync(cancellationToken);

            var eCompanyWireAch = null as EntityEntry<CompanyWireAchDetail>;
            if (dbCompanyWireAchDetails == null)
            {
                eCompanyWireAch = await portalContext.AddAsync(new CompanyWireAchDetail
                {
                    ExternalRowVersion = ObjCompanyWireAch.ExternalRowVersion,
                    InvoiceNumber = ObjCompanyWireAch.InvoiceNumber,
                    WireBankId = ObjCompanyWireAch.WireBankId,
                    RemitSortcode = ObjCompanyWireAch.RemitSortcode,
                    RemitBan = ObjCompanyWireAch.RemitBan,
                    SwiftName = ObjCompanyWireAch.SwiftName,
                    Swift = ObjCompanyWireAch.Swift,
                    WireCurrency = ObjCompanyWireAch.WireCurrency,
                    WireName2 = ObjCompanyWireAch.WireName2,
                    WireBank2 = ObjCompanyWireAch.WireBank2,
                    WireAccount2 = ObjCompanyWireAch.WireAccount2,
                    Swift2 = ObjCompanyWireAch.Swift2,
                    WireCurrency2 = ObjCompanyWireAch.WireCurrency2,
                    WireClearing = ObjCompanyWireAch.WireClearing,
                    WireAccountNumber = ObjCompanyWireAch.WireAccountNumber,
                    WireBank = ObjCompanyWireAch.WireBank,
                    WireBranch = ObjCompanyWireAch.WireBranch,
                    WireName = ObjCompanyWireAch.WireName,
                    WireRoutingNumber = ObjCompanyWireAch.WireRoutingNumber

                }, cancellationToken);
            }
            else
            {
                dbCompanyWireAchDetails.CopyIf(x => x.ExternalRowVersion, ObjCompanyWireAch, DataExtensions.AreDifferent);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.InvoiceNumber, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireBankId, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.RemitSortcode, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.RemitBan, ObjCompanyWireAch);

                dbCompanyWireAchDetails.CopyNotEmpty(x => x.SwiftName, ObjCompanyWireAch);

                dbCompanyWireAchDetails.CopyNotEmpty(x => x.Swift, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireCurrency, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireName2, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireBank2, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireAccount2, ObjCompanyWireAch);

                dbCompanyWireAchDetails.CopyNotEmpty(x => x.Swift2, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireCurrency2, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireClearing, ObjCompanyWireAch);

                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireAccountNumber, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireBank, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireBranch, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireName, ObjCompanyWireAch);
                dbCompanyWireAchDetails.CopyNotEmpty(x => x.WireRoutingNumber, ObjCompanyWireAch);

                eCompanyWireAch = portalContext.Update(dbCompanyWireAchDetails);
            }

            await portalContext.SaveAsync(cancellationToken);

            dbCompanyWireAchDetails = eCompanyWireAch.Entity;

            portalContext.Entry(dbCompanyWireAchDetails).State = EntityState.Detached;


            return dbCompanyWireAchDetails;
        }


        public async Task<bool> InvoiceChangedAsync(Models.X3.Invoice invoice, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbInvoice = null as Invoice;

            dbInvoice = await portalContext
                .Invoices
                .Where(x => x.InvoiceNumber == invoice.Number)
                .FirstOrDefaultAsync(cancellationToken);

            if (dbInvoice == null)
                return true;

            if (!invoice.RowVersion.AreDifferent(dbInvoice?.ExternalRowVersion1))
                return false;

            return true;

        }


        public async Task<Invoice> SaveInvoiceAsync(Invoice invoice, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbInvoice = null as Invoice;

            if (invoice == null)
                return dbInvoice;


            var invalidDate = new DateTime(1980, 1, 1);


            invoice.SetIf(x => x.InvoiceDate, DateTime.Now.Date.AddYears(-1), d => d < invalidDate);
            invoice.SetIf(x => x.DateDue, null, d => d.HasValue && d.Value < invalidDate);
            invoice.SetIf(x => x.ServiceFrom, null, d => d.HasValue && d.Value < invalidDate);
            invoice.SetIf(x => x.ServiceTo, null, d => d.HasValue && d.Value < invalidDate);




            dbInvoice = await portalContext
                .Invoices
                .Where(x => x.InvoiceNumber == invoice.InvoiceNumber)
                .Include(x => x.BilledToAccount)
                .Include(x => x.SoldToAccount)
                .Include(x => x.BillingEntity)
                .Include(x => x.ShippingAddress)
                .Include(x => x.Details)
                .Include(x => x.Taxes)
                .FirstOrDefaultAsync(cancellationToken);



            if (!invoice.ExternalRowVersion.AreDifferent(dbInvoice?.ExternalRowVersion1))
                return dbInvoice;


            var address = await SaveAddressAsync(invoice.ShippingAddress, null, cancellationToken) ?? dbInvoice?.ShippingAddress;
            //using (var ts = new TransactionScope(TransactionScopeOption.RequiresNew, TransactionScopeAsyncFlowOption.Enabled))
            //{
            var eInvoice = null as EntityEntry<Invoice>;
            if (dbInvoice == null)
            {
                eInvoice = await portalContext.AddAsync(new Invoice
                {
                    InvoiceNumber = invoice.InvoiceNumber,
                    SellingEntity = invoice.SellingEntity,
                    BillingEntity = invoice.BillingEntity,
                    SoldToAccount = invoice.SoldToAccount,

                    BilledToAccount = invoice.BilledToAccount,
                    InvoiceDate = invoice.InvoiceDate,

                    CustomerPurchaseOrderNumber = invoice.CustomerPurchaseOrderNumber,
                    CustomerReferenceNumber = invoice.CustomerReferenceNumber,
                    DateDue = invoice.DateDue,
                    Comments = invoice.Comments,

                    Currency = invoice.Currency,
                    DiscountAmount = invoice.DiscountAmount,
                    Total = invoice.Total,
                    SubTotalAmount = invoice.SubTotalAmount,
                    TaxAmount = invoice.TaxAmount,
                    TaxRate = invoice.TaxRate,
                    TaxId = invoice.TaxId.Left(20),
                    Balance = invoice.Balance,
                    BalanceCurrency = invoice.BalanceCurrency,

                    IncoTerms = invoice.IncoTerms,
                    PaymentTerms = invoice.PaymentTerms,
                    ServiceFrom = invoice.ServiceFrom,
                    ServiceTo = invoice.ServiceTo,

                    ShippingMethod = invoice.ShippingMethod,
                    ShippingAddress = invoice.ShippingAddress,
                    ShippingNumber = invoice.ShippingNumber,
                    ShippingResult = invoice.ShippingResult,

                    ExternalRowVersion = invoice.ExternalRowVersion,
                    ExternalRowVersion1 = invoice.ExternalRowVersion,
                }, cancellationToken);

                portalContext.Entry(eInvoice.Entity.BillingEntity).State = EntityState.Unchanged;
                portalContext.Entry(eInvoice.Entity.SellingEntity).State = EntityState.Unchanged;
            }
            else
            {

                if (dbInvoice.Balance != invoice.Balance && invoice.Balance == 0)
                //try to update a payment
                {
                    logger.LogInformation($"Invoice {invoice.InvoiceNumber} balance shows 0");
                    var invoicePayment = await portalContext.InvoicePayments.FirstOrDefaultAsync(x => x.InvoiceNumber == invoice.InvoiceNumber && x.Status == InvoicePaymentStatus.Processed);
                    if (invoicePayment != null)
                    {
                        invoicePayment.Status = InvoicePaymentStatus.Paid;
                        portalContext.Update(invoicePayment);
                        logger.LogInformation($"Invoice {invoice.InvoiceNumber} payment status marked as PAID");
                    }
                    else { logger.LogInformation($"Invoice {invoice.InvoiceNumber} invoice payment record not found."); }
                }

                //dbInvoice.CopyNotNull(x => x.SellingEntity, invoice);
                //dbInvoice.CopyNotNull(x => x.BillingEntity, invoice);
                dbInvoice.CopyNotNull(x => x.BilledToAccount, invoice);
                dbInvoice.CopyNotNull(x => x.SoldToAccount, invoice);

                dbInvoice.CopyNotEmpty(x => x.CustomerPurchaseOrderNumber, invoice);
                dbInvoice.CopyNotEmpty(x => x.CustomerReferenceNumber, invoice);
                dbInvoice.CopyNotNull(x => x.DateDue, invoice);
                dbInvoice.CopyNotEmpty(x => x.Comments, invoice);

                dbInvoice.CopyNotEmpty(x => x.Currency, invoice);
                dbInvoice.CopyNotNull(x => x.DiscountAmount, invoice);
                dbInvoice.CopyNotNull(x => x.Total, invoice);
                dbInvoice.CopyNotNull(x => x.SubTotalAmount, invoice);
                dbInvoice.CopyNotNull(x => x.TaxAmount, invoice);
                dbInvoice.CopyNotNull(x => x.TaxRate, invoice);
                //dbInvoice.CopyNotEmpty(x => x.TaxId, invoice);
                dbInvoice.TaxId = invoice.TaxId.Left(20);
                //dbInvoice.CopyNotNull(x => x.Balance, invoice);
                dbInvoice.Balance = invoice.Balance;
                dbInvoice.CopyNotEmpty(x => x.BalanceCurrency, invoice);

                dbInvoice.CopyNotEmpty(x => x.IncoTerms, invoice);
                dbInvoice.CopyNotEmpty(x => x.PaymentTerms, invoice);
                dbInvoice.CopyNotNull(x => x.ServiceFrom, invoice);
                dbInvoice.CopyNotNull(x => x.ServiceTo, invoice);

                dbInvoice.CopyNotEmpty(x => x.ShippingMethod, invoice);
                dbInvoice.SetIf(x => x.ShippingAddress, address, DataExtensions.AreDifferent);
                dbInvoice.CopyNotEmpty(x => x.ShippingNumber, invoice);
                dbInvoice.CopyNotEmpty(x => x.ShippingResult, invoice);

                dbInvoice.CopyNotNull(x => x.ExternalRowVersion, invoice);
                dbInvoice.ExternalRowVersion1 = invoice.ExternalRowVersion1;

                //portalContext.Entry(dbInvoice).State = EntityState.Modified;
                //portalContext.Entry(dbInvoice.BillingEntity).State = EntityState.Detached;
                //portalContext.Entry(dbInvoice.SellingEntity).State = EntityState.Detached;

                eInvoice = portalContext.Update(dbInvoice);


            }

            await portalContext.SaveAsync(cancellationToken);

            dbInvoice = eInvoice.Entity;

            logger.LogInformation($"Invoice {invoice.InvoiceNumber} imported into the Portal DB");

            foreach (var detail in invoice.Details)
                await SaveInvoiceDetailAsync(dbInvoice, detail, cancellationToken);

            foreach (var tax in invoice.Taxes)
                await SaveInvoiceTaxAsync(dbInvoice, tax, cancellationToken);

            portalContext.Entry(dbInvoice).State = EntityState.Detached;


            return dbInvoice;
        }

        /// <summary>
        /// // Author : Vinod Patil (PIP) , Purpose : Save Invoice header details
        /// </summary>
        /// <param name="ObjInvoiceHeaderAdditional"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<InvoiceHeaderExtension> SaveInvoicHeaderAdditionalDetailsAsync(InvoiceHeaderExtension ObjInvoiceHeaderAdditional, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbInvoiceExtension = null as InvoiceHeaderExtension;

            if (ObjInvoiceHeaderAdditional == null)
                return dbInvoiceExtension;

            dbInvoiceExtension = await portalContext
                .InvoiceHeaderExtensions
                .Where(x => x.InvoiceNumber == ObjInvoiceHeaderAdditional.InvoiceNumber)
                .Include(x => x.PayByAddress)
                .FirstOrDefaultAsync(cancellationToken);


            var payCustomerAddress = await SaveAddressAsync(ObjInvoiceHeaderAdditional.PayByAddress, null, cancellationToken) ?? dbInvoiceExtension?.PayByAddress;

            var RemitToAddress = await SaveAddressAsync(ObjInvoiceHeaderAdditional.RemitAddress, null, cancellationToken) ?? dbInvoiceExtension?.PayByAddress;

            var BillToAddress = await SaveAddressAsync(ObjInvoiceHeaderAdditional.BillToAddress, null, cancellationToken) ?? dbInvoiceExtension?.BillToAddress;

            var ShipToAddress = await SaveAddressAsync(ObjInvoiceHeaderAdditional.ShipToAddress, null, cancellationToken) ?? dbInvoiceExtension?.ShipToAddress;


            var eInvoiceHeaderExtension = null as EntityEntry<InvoiceHeaderExtension>;

            if (dbInvoiceExtension == null)
            {
                eInvoiceHeaderExtension = await portalContext.AddAsync(new InvoiceHeaderExtension
                {
                    InvoiceNumber = ObjInvoiceHeaderAdditional.InvoiceNumber,
                    ExternalRowVersion = ObjInvoiceHeaderAdditional.ExternalRowVersion,
                    Logo = ObjInvoiceHeaderAdditional.Logo,
                    DocType = ObjInvoiceHeaderAdditional.DocType,
                    InvoiceCurrency = ObjInvoiceHeaderAdditional.InvoiceCurrency,
                    Memo = ObjInvoiceHeaderAdditional.Memo,
                    PdcrAmount = ObjInvoiceHeaderAdditional.PdcrAmount,
                    PaymentReference = ObjInvoiceHeaderAdditional.PaymentReference,
                    CheckNumber = ObjInvoiceHeaderAdditional.CheckNumber,
                    PayAmount = ObjInvoiceHeaderAdditional.PayAmount,
                    ImporteTOT = ObjInvoiceHeaderAdditional.ImporteTOT,
                    PayByCustomer = ObjInvoiceHeaderAdditional.PayByCustomer,
                    PayByName = ObjInvoiceHeaderAdditional.PayByName,
                    PayByAddress = payCustomerAddress,
                    CPY = ObjInvoiceHeaderAdditional.CPY,
                    RemitCurrency = ObjInvoiceHeaderAdditional.RemitCurrency,
                    RemitName = ObjInvoiceHeaderAdditional.RemitName,
                    RemitAddress = RemitToAddress,
                    BillToName = ObjInvoiceHeaderAdditional.BillToName,
                    BillToAddress = BillToAddress,
                    ShipToName = ObjInvoiceHeaderAdditional.ShipToName,
                    ShipToAddress = ShipToAddress,
                    CustTaxId = ObjInvoiceHeaderAdditional.CustTaxId,
                    CustTaxPrefix = ObjInvoiceHeaderAdditional.CustTaxPrefix

                }, cancellationToken);
            }
            else
            {

                dbInvoiceExtension.CopyNotNull(x => x.InvoiceNumber, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.Logo, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.DocType, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.InvoiceCurrency, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.Memo, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.PdcrAmount, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.PaymentReference, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.CheckNumber, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.PayAmount, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.ImporteTOT, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.PayByCustomer, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.PayByName, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.CPY, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.RemitCurrency, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.RemitName, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.CustTaxId, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.CopyNotNull(x => x.CustTaxPrefix, ObjInvoiceHeaderAdditional);
                dbInvoiceExtension.ExternalRowVersion = ObjInvoiceHeaderAdditional.ExternalRowVersion;

                eInvoiceHeaderExtension = portalContext.Update(dbInvoiceExtension);

            }

            await portalContext.SaveAsync(cancellationToken);

            dbInvoiceExtension = eInvoiceHeaderExtension.Entity;

            portalContext.Entry(dbInvoiceExtension).State = EntityState.Detached;

            return dbInvoiceExtension;
        }


        public async Task<InvoiceDetail> SaveInvoiceDetailAsync(Invoice dbInvoice, InvoiceDetail detail, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbDetail = await portalContext
                .InvoiceDetails
                .Where(x => x.Invoice.InvoiceNumber.ToLower() == dbInvoice.InvoiceNumber.ToLower() &&
                            x.LineNumber == detail.LineNumber)
                .FirstOrDefaultAsync(cancellationToken);


            if (detail.ExternalRowVersion.AreDifferent(dbDetail?.ExternalRowVersion))
            {
                var eDetail = null as EntityEntry<InvoiceDetail>;
                if (dbDetail == null)
                {
                    eDetail = await portalContext.AddAsync(new InvoiceDetail
                    {
                        ExternalRowVersion = detail.ExternalRowVersion,
                        InvoiceNumber = detail.InvoiceNumber,
                        LineNumber = detail.LineNumber,
                        Item = detail.Item,
                        Description = detail.Description,

                        Quantity = detail.Quantity,
                        UnitPrice = detail.UnitPrice,
                        UnitDiscount = detail.UnitDiscount,
                        LineTaxRate = detail.LineTaxRate,
                        Discount = detail.Discount,
                        ExtraAmount = detail.ExtraAmount,
                    }, cancellationToken);
                }
                else
                {
                    dbDetail.CopyIf(x => x.ExternalRowVersion, detail, DataExtensions.AreDifferent);
                    dbDetail.CopyNotEmpty(x => x.Item, detail);
                    dbDetail.CopyNotEmpty(x => x.Description, detail);
                    dbDetail.CopyNotNull(x => x.Quantity, detail);
                    dbDetail.CopyNotNull(x => x.UnitPrice, detail);
                    dbDetail.CopyNotNull(x => x.UnitDiscount, detail);

                    dbDetail.CopyNotNull(x => x.Discount, detail);
                    dbDetail.CopyNotNull(x => x.ExtraAmount, detail);
                    dbDetail.CopyNotNull(x => x.LineTaxRate, detail);

                    eDetail = portalContext.Update(dbDetail);
                }

                await portalContext.SaveAsync(cancellationToken);

                dbDetail = eDetail.Entity;
            }
            logger.LogInformation($"Invoice Details {dbInvoice.InvoiceNumber} imported into the Portal DB");
            return dbDetail;
        }

        public async Task<InvoiceTax> SaveInvoiceTaxAsync(Invoice dbInvoice, InvoiceTax tax, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbTax = await portalContext
                .InvoiceTaxes
                .Where(x => x.Invoice.InvoiceNumber.ToLower() == dbInvoice.InvoiceNumber.ToLower() &&
                            x.BPR == tax.BPR && x.TaxDesc.ToLower() == tax.TaxDesc.ToLower())
                .FirstOrDefaultAsync(cancellationToken);


            if (dbTax == null)
            {
                var eTax = null as EntityEntry<InvoiceTax>;

                eTax = await portalContext.AddAsync(new InvoiceTax
                {
                    BPR = tax.BPR,
                    TaxAmount = tax.TaxAmount,
                    TaxDesc = tax.TaxDesc,
                    InvoiceNumber = tax.InvoiceNumber,

                }, cancellationToken);


                await portalContext.SaveAsync(cancellationToken);

                dbTax = eTax.Entity;
            }

            return dbTax;
        }

        public async Task<Account> CheckAccountRegisteredAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            //return null;

            var account = null as Account;

            var checkClaim = await portalContext
                    .UserClaims
                    .FirstOrDefaultAsync(x => x.ClaimValue == accountNumber, cancellationToken)
                    .CatchDbAsync(logger);

            if (checkClaim == null)
                return new Account();

            return account;
        }

        public async Task<Account> CheckAccountAsync(string accountNumber, string pin, CancellationToken cancellationToken = default(CancellationToken))
        {
            var account = null as Account;

            var externalCustomer = await x3Context
                .Customers
                .FirstOrDefaultAsync(x => x.CustomerNumber == accountNumber, cancellationToken)
                .CatchDbAsync(logger);

            var customer = externalCustomer;
            if (customer != null)
            {
                account = await SaveAccountAsync(new Account
                {
                    ExternalRowVersion = customer.RowVersion,

                    Name = customer.Name,
                    Number = customer.CustomerNumber,
                    PhysicalAddress = new Address
                    {
                        Line1 = customer.Address1,
                        Line2 = customer.Address2,
                        Line3 = customer.Address3,
                        Municipality = customer.City,
                        StateOrProvince = customer.State,
                        Country = customer.Country ?? " ",
                        PostalCode = customer.PostalCode,
                    },
                    Pin = pinOverride ? testpin : customer.PinNumber,
                    PhoneNumber = customer.Phone,
                    Currency = customer.Currency,
                    Language = customer.Language
                }, cancellationToken);
            }
            else
            {
                account = await GetAccountAsync(accountNumber, cancellationToken);
            }



            return string.Equals(account?.Pin, pin, StringComparison.OrdinalIgnoreCase)
                    ? account
                    : null;
        }

        private async Task<string> testChaseForPCard(PaymentMethod method, MerchantAccount merchantAccount, string transactionNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var request = new Chase.NewOrderRequestElement
            {
                orbitalConnectionUsername = merchantAccount.Uid,
                orbitalConnectionPassword = merchantAccount.Pwd,
                merchantID = merchantAccount.MerchantId,
                bin = "000001",
                amount = "0",
                industryType = "EC",
                //customerRefNum = method.Token,
                transType = "A",
                terminalID = "001",
                orderID = transactionNumber,
                cardIndicators = "Y",
                ccAccountNum = method.PaymentAccountNumber,
                ccCardVerifyNum = method.CCV,
                version = "3.9.3"
            };


            if (method.PaymentType == PaymentType.Discover || method.PaymentType == PaymentType.JCB)
            {
                request.amount = "1";
            }

            if (method.ExpiresOn.HasValue)
                request.ccExp = $"{method.ExpiresOn.Value.Year}{method.ExpiresOn.Value.Month.ToString().PadLeft(2, '0')}";  //format yyyymm

            var client = new Chase.PaymentechGatewayClient(Chase.PaymentechGatewayClient.EndpointConfiguration.PaymentechGateway, chaseConfig.Gateway);

            var chaseResult = await client.NewOrderAsync(request).InvokeAsync(logger);


            if (chaseResult.Result.@return.ctiLevel3Eligible != null)
                return chaseResult.Result.@return.ctiLevel3Eligible;


            return "N";
        }

        private async Task<ITaskResult<Chase.NewOrderResponse>> submitPaymentToChaseAsync(PaymentMethod method, MerchantAccount merchantAccount, string transactionNumber, int amount, ICollection<string> invoices, CancellationToken cancellationToken = default(CancellationToken))
        {

            logger.LogDebug($"Submit Payment To Chase is initiated");

            var request = new Chase.NewOrderRequestElement
            {
                orbitalConnectionUsername = merchantAccount.Uid,
                orbitalConnectionPassword = merchantAccount.Pwd,
                merchantID = merchantAccount.MerchantId,
                bin = "000001",
                amount = amount.ToString(),
                industryType = "RC",
                customerRefNum = method.Token,
                transType = "AC",
                terminalID = "001",
                orderID = transactionNumber,
                retryTrace = transactionNumber.Replace("-", "").Left(16),
                version = "3.9.3",

            };

            if (method.PaymentType == PaymentType.MasterCard || method.PaymentType == PaymentType.Visa || method.PaymentType == PaymentType.Discover)
            {
                request.mitMsgType = "MREC";
                request.mitStoredCredentialInd = "Y";
            }


            //using branch to store Level 3 Eligible
            if (method.Branch == "Y")
            {
                //level 2
                request.taxInd = "1";
                request.taxAmount = "1";
                request.pCardOrderID = "UNKOWN";
                request.pCard3FreightAmt = "1";
                request.pCard3DutyAmt = "1";
                int detailIndex = 0;

                Chase.PC3LineItemArray lineItems = new Chase.PC3LineItemArray();


                foreach (string s in invoices)
                {

                    Invoice inv = await portalContext.Invoices.Where(x => x.InvoiceNumber == s)
                        .Include(m => m.SellingEntity)
                        .Include(m => m.SellingEntity.ShippingAddress)
                        .Include(m => m.ShippingAddress)
                        .Include(m => m.Details)
                        .FirstOrDefaultAsync(cancellationToken)
                        .CatchDbAsync(logger);

                    request.pCard3ShipFromZip = inv.SellingEntity.ShippingAddress.PostalCode ?? inv.SellingEntity.PhysicalAddress.PostalCode;
                    request.pCard3DestCountryCd = "USA"; //inv.ShippingAddress.Country;
                    request.pCardDestZip = inv.ShippingAddress.PostalCode;
                    if (method.PaymentType == PaymentType.Visa)
                        request.pCard3DiscAmt = "0";

                    //level 3 

                    foreach (InvoiceDetail invoiceDetail in inv.Details)
                    {
                        var lineItem = new Chase.PC3LineItem();

                        detailIndex += 1;

                        lineItem.pCard3DtlIndex = detailIndex.ToString();
                        lineItem.pCard3DtlDesc = invoiceDetail.Description.Left(26).Replace("-", " ");
                        lineItem.pCard3DtlProdCd = invoiceDetail.Item.Replace("-", " ");
                        lineItem.pCard3DtlQty = ((int)invoiceDetail.Quantity * 10000).ToString();
                        lineItem.pCard3DtlUOM = "WSD"; //no idea
                        lineItem.pCard3DtlTaxAmt = "1"; //not included
                        lineItem.pCard3DtlTaxRate = "1";
                        lineItem.pCard3Dtllinetot = ((int)invoiceDetail.ExtraAmount * 100).ToString();
                        if (method.PaymentType == PaymentType.Visa)
                            lineItem.pCard3DtlCommCd = "48530";
                        if (method.PaymentType == PaymentType.MasterCard)
                            lineItem.pCard3DtlDiscInd = "N";
                        lineItem.pCard3DtlUnitCost = ((int)invoiceDetail.UnitPrice * 10000).ToString();
                        lineItem.pCard3DtlGrossNet = "Y";

                        logger.LogInformation($" Invoice Number : {invoiceDetail.InvoiceNumber}, Method Payment Type : {method.PaymentType}, pCard3DtlCommCd {lineItem.pCard3DtlCommCd}");

                        lineItems.Add(lineItem);

                    }

                    request.pCard3LineItemCount = detailIndex.ToString();
                    request.pCard3LineItems = lineItems;

                }
            }


            var client = new Chase.PaymentechGatewayClient(Chase.PaymentechGatewayClient.EndpointConfiguration.PaymentechGateway, chaseConfig.Gateway);
            int i = 0;
            ITaskResult<Chase.NewOrderResponse> chaseResult = null;

            for (i = 0; i < chaseConfig.NewOrderRetry; i++)
            {
                chaseResult = await client.NewOrderAsync(request).InvokeAsync(logger);
                if (chaseResult != null)
                    return chaseResult;
            }
            return chaseResult;
        }

        public async Task<string> BeginPaymentTransactionAsync(string methodId, decimal paymentAmount, ICollection<string> invoices, DateTimeOffset? dateScheduled = null, string checkNumber = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            var method = await portalContext
                .PaymentMethods
                .FirstOrDefaultAsync(x => x.Id == Guid.Parse(methodId),
                                     cancellationToken)
                .CatchDbAsync(logger);
            if (method == null)
                return null;


            var dbInvoices = await portalContext.Invoices
                .Where(x => invoices.Contains(x.InvoiceNumber))
                .Include(x => x.Payments)
                .ToArrayAsync(cancellationToken);

            var missing = invoices.Except(dbInvoices.Select(d => d.InvoiceNumber));
            var valid = invoices.Except(missing);

            var transactionNumber = $"{method.AccountNumber}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

            var pending = valid.Select(i => (invoice: dbInvoices.First(d => d.InvoiceNumber == i), payment: new InvoicePayment
            {
                TransactionNumber = $"{transactionNumber}:{i}",
                PaymentMethod = method,
                InvoiceNumber = i,
                Status = InvoicePaymentStatus.Pending,
                DateAuthorized = DateTimeOffset.Now,
                DateScheduled = dateScheduled,
                CheckNumber = checkNumber,
                TransactionAmount = paymentAmount,
                Amount = 0,
                IsAcceptedPayTC = true,
            }));


            foreach (var (invoice, payment) in pending)
            {
                if (invoice.Currency != method.Currency)
                    return null;

                if (invoice.Balance > 0)
                {
                    if (paymentAmount >= invoice.Balance)
                    {
                        payment.Amount = invoice.Balance;
                        paymentAmount -= invoice.Balance;
                    }
                    else
                    {
                        payment.Amount = paymentAmount;
                        paymentAmount = 0;
                    }
                    await portalContext.AddAsync(payment);

                }
            }

            using (var ts = new TransactionScope(TransactionScopeOption.RequiresNew, TransactionScopeAsyncFlowOption.Enabled))
            {
                await portalContext.SaveAsync();

                ts.Complete();
            }

            return transactionNumber;
        }
        public async Task<ITaskResult<PaymentResult>> SubmitPaymentAsync(string accountNumber, Guid paymentMethodId, string transactionNumber, decimal paymentAmount, ICollection<string> invoices, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = null as PaymentResult;
            var amount = (int)(paymentAmount * 100);

            var method = await GetPaymentMethodAsync(accountNumber, paymentMethodId);
            if (method == null)
                throw new PortalException(PortalExceptionType.Entity_Missing, nameof(PaymentMethod));

            var currency = method.Currency ?? method.Account.Currency ?? "USD";
            var merchantAccount = determineMerchantAccountToUse(currency);


            var chaseResult = await submitPaymentToChaseAsync(method, merchantAccount, transactionNumber, amount, invoices, cancellationToken);


            if (chaseResult.IsFailure)
            {
                var errorArray = chaseResult.Values.SingleOrDefault();

                var errorMessage = string.Join(",", errorArray);
                result = new PaymentResult
                {
                    ApprovalStatus = "-1",
                    Message = errorMessage,
                    CustomerProfile = method.Token
                };
                return result.AsFailure().Add("Transaction Declined", "Transaction Declined");
            }
            var response = chaseResult.Result;
            result = new PaymentResult
            {
                ApprovalStatus = response.@return.approvalStatus,
                ConfirmationNumber = response.@return.txRefNum,
                ProcessorStatus = response.@return.procStatusMessage,
                Message = "Success"
            };

            return result.AsSuccess();

        }
        public async Task<bool> CompletePaymentTransactionAsync(string transactionNumber, string confirmationNumber, string processorStatus, string approvalStatus, CancellationToken cancellationToken = default(CancellationToken))
        {
            var payments = await portalContext
                .InvoicePayments
                .Where(x => x.TransactionNumber.StartsWith(transactionNumber)
                         && x.Status == InvoicePaymentStatus.Pending)
                .Include(x => x.Invoice)
                .ToArrayAsync(cancellationToken);


            // Chase Response
            var chaseResponse = $"Transaction {transactionNumber}: ConfirmationNumber: {confirmationNumber}, ProcessorStatus:{processorStatus}, ApprovalStatus:{approvalStatus}, Message:Success";

            foreach (var payment in payments)
            {
                payment.DateFinalized = DateTimeOffset.Now;
                payment.ConfirmationNumber = confirmationNumber;
                payment.ProcessorStatus = processorStatus;
                payment.ApprovalStatus = approvalStatus;
                payment.Status = InvoicePaymentStatus.Processed;
                payment.ChaseResponse = chaseResponse;
            }


            using (var ts = new TransactionScope(TransactionScopeOption.RequiresNew, TransactionScopeAsyncFlowOption.Enabled))
            {
                await portalContext.SaveAsync();

                ts.Complete();
            }

            return true;
        }

        public async Task<bool> CancelPaymentTransactionAsync(string transactionNumber, string chaseResponse, bool failed = true,  CancellationToken cancellationToken = default(CancellationToken))
        {
            var payments = await portalContext
                .InvoicePayments
                .Where(x => x.TransactionNumber.StartsWith(transactionNumber)
                         && (x.Status == InvoicePaymentStatus.Pending || x.Status == InvoicePaymentStatus.Scheduled))
                .Include(x => x.Invoice)
                .ToArrayAsync(cancellationToken);


            foreach (var payment in payments)
            {
                payment.Status = failed ? InvoicePaymentStatus.Failed : InvoicePaymentStatus.Cancelled;
                payment.DateFinalized = DateTimeOffset.Now;
                payment.ChaseResponse = chaseResponse;
            }


            using (var ts = new TransactionScope(TransactionScopeOption.RequiresNew, TransactionScopeAsyncFlowOption.Enabled))
            {
                await portalContext.SaveAsync();

                ts.Complete();
            }

            return true;
        }
        public async Task<string> RetryPaymentAsync(string accountNumber, string priorTransactionNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var payments = await portalContext.InvoicePayments
                .Where(x => x.Invoice.BilledToAccountNumber == accountNumber
                         && x.TransactionNumber == priorTransactionNumber
                         && x.Status == InvoicePaymentStatus.Failed)
                .ToArrayAsync(cancellationToken);

            var method = payments.First().PaymentMethod;

            var transactionNumber = $"{method.Id.ToString("N")}-{DateTimeOffset.UtcNow.Ticks}";

            var pending = payments.Select(p => new InvoicePayment
            {
                TransactionNumber = $"{transactionNumber}:{p.InvoiceNumber}",
                InvoiceNumber = p.InvoiceNumber,
                PaymentMethod = method,
                Status = InvoicePaymentStatus.Pending,
                DateAuthorized = DateTimeOffset.Now,
                DateScheduled = p.DateScheduled,
                CheckNumber = p.CheckNumber,
                TransactionAmount = p.TransactionAmount,
                Amount = p.Amount
            });



            using (var ts = new TransactionScope(TransactionScopeOption.RequiresNew, TransactionScopeAsyncFlowOption.Enabled))
            {
                await portalContext.AddRangeAsync(pending);
                await portalContext.SaveAsync();

                ts.Complete();
            }

            return transactionNumber;
        }

        public async Task<IList<InvoicePayment>> GetScheduledPaymentsAsync(string accountNumber = null, DateTimeOffset? from = null, DateTimeOffset? until = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            var hasAccountNumber = !string.IsNullOrWhiteSpace(accountNumber);
            var hasFrom = from.HasValue;
            var hasUntil = until.HasValue;

            if (hasFrom && hasUntil)
                if (from >= until)
                    throw new ArgumentOutOfRangeException(nameof(until), $"{from} >= {until}", "until must be after from");


            var payments = await portalContext.InvoicePayments
                .Where(x => (!hasFrom || (x.DateScheduled.HasValue && x.DateScheduled >= from.Value))
                         && (!hasUntil || (x.DateScheduled.HasValue && x.DateScheduled < until.Value))
                         && x.Status == InvoicePaymentStatus.Scheduled
                         && (!hasAccountNumber || x.Invoice.BilledToAccountNumber == accountNumber))
                .ToArrayAsync(cancellationToken);

            return payments;
        }
        public async Task<IList<Invoice>> GetUnScheduledInvoicesAsync(string accountNumber = null, bool full = false, CancellationToken cancellationToken = default(CancellationToken))
        {
            var hasAccountNumber = !string.IsNullOrWhiteSpace(accountNumber);


            var openStatuses = (int)(InvoiceStatus.Due | InvoiceStatus.Overdue);

            var qry = portalContext.Invoices
                .Where(u => (!hasAccountNumber || u.BilledToAccount.Number == accountNumber))
                .Where(u => u.BilledToAccount.PaymentMethods.Any(p => !p.IsDisabled && !p.IsDeleted && p.IsAuto))
                .Where(u => (((int)u.Status) & openStatuses) > 0)
                .Where(u => ((u.Balance - u.Payments.Where(p => (p.Status == InvoicePaymentStatus.Processed || p.Status == InvoicePaymentStatus.Paid || p.Status == InvoicePaymentStatus.Pending)).Sum(p => p.Amount)) > 0) ||
                            ((u.Balance - u.Payments.Where(p => (p.Status == InvoicePaymentStatus.Processed || p.Status == InvoicePaymentStatus.Paid || p.Status == InvoicePaymentStatus.Pending)).Sum(p => p.Amount)) == null))
                .Where(u => u.Balance > 0)
                .Where(u => u.PaymentTerms == "NET30AUTOPAY");

            if (full)
                qry = qry
                    .Include(u => u.ShippingAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.SellingEntity).ThenInclude(x => x.ShippingAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.BillingEntity).ThenInclude(x => x.ShippingAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.BilledToAccount).ThenInclude(x => x.ShippingAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.BillingAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.MailingAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.PhysicalAddress)
                    .Include(u => u.SoldToAccount).ThenInclude(x => x.ShippingAddress);

            qry = qry
                .Include(u => u.Details)
                .Include(u => u.Payments);

            var data = await qry.ToListAsync(cancellationToken);

            logger.LogDebug($"Invoice Data  count : {data.Count}");

            return data;
        }

        public async Task<string[]> GetEligibleImportCustomerAsync(CancellationToken cancellationToken = default(CancellationToken))
        {

            List<string> returnResult = new List<string>();

            string[] customers = portalContext.Accounts.Select(i => i.Number).Distinct().ToArray();

            logger.LogInformation($" Total {customers.Length}  populated to check the eligible import invoices customer");

            try
            {

                foreach (var accountNumber in customers)
                {
                    var importedInvoices = await x3Context
                   .InvoiceHeaders
                   .Where(x => x.BillToCustomer == accountNumber)
                   .Select(x => new { x.Number, x.RowVersion })
                   .ToDictionaryAsync(x => x.Number, x => x.RowVersion, cancellationToken)
                   ?? new Dictionary<string, byte[]>();


                    if (importedInvoices.Count == 0)
                    {
                        continue;
                    }

                    var savedInvoices = await portalContext
                    .Invoices
                    .Where(x => x.BilledToAccount.Number == accountNumber)
                    .Select(x => new { x.InvoiceNumber, x.ExternalRowVersion1 })
                    .ToDictionaryAsync(x => x.InvoiceNumber, x => x.ExternalRowVersion1, cancellationToken)
                    ?? new Dictionary<string, byte[]>();


                    var result = importedInvoices
                          .Where(kv => !savedInvoices.ContainsKey(kv.Key) ||
                                       savedInvoices[kv.Key].AreDifferent(kv.Value))
                          .Select(kv => kv.Key)
                          .ToList();


                    if ((result.Count > 0) || (importedInvoices.Count > 0 && savedInvoices.Count == 0))
                    {
                        returnResult.Add(accountNumber);

                    }

                }
            }
            catch(Exception ed)
            {

            }

            logger.LogInformation($"Finally, Total Customer {returnResult.Count}  eligible to import invoices...");


            return returnResult.ToArray();
        }

        /// <summary>
        /// Get Billed to Account business Language, default = English
        /// </summary>
        /// <param name="accountNumber"></param>
        /// <returns></returns>
        public async Task<string> GetAccountLanguage(string accountNumber)
        {
            Account account = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == accountNumber);

            if (account != null)
            {
                return account.Language;
            }

            return "en";
        }

        public async Task<ITaskResult> SendEmailAsync(
           string recipientName,
           string recipientEmail,
           string subject,
           string body,
           string accountNumber,
           string amount,
           string exceptionDetails,
           bool isHtml = true)
        {
            var from = new MailboxAddress(this.smtpConfig.Name, this.smtpConfig.EmailAddress);
            var to = new MailboxAddress(recipientName, recipientEmail);

            Account account = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == accountNumber);

            string emailMessage = body
             .Replace("{customerName}", account.Name)
             .Replace("{accountNumber}", account.Number)
             .Replace("{amount}", amount)
             .Replace("{error}", exceptionDetails);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, emailMessage, isHtml);
        }

        public async Task<ITaskResult> SendInvoiceNotification(string emailContent, string accountNumber, string dateDue, string balance, string balanceCurrency)
        {
            var checkClaim = portalContext
                    .UserClaims
                    .Where(w => w.ClaimValue == accountNumber).SingleOrDefault();

            if (checkClaim != null)
            {
                var userProfile = portalContext
                    .Users
                    .Find(checkClaim.UserId);
                var from = new MailboxAddress(this.smtpConfig.Name, this.smtpConfig.EmailAddress);
                var to = new MailboxAddress($"{userProfile.FirstName} {userProfile.LastName}", userProfile.Email);

                var customerLanguage = GetAccountLanguage(accountNumber).Result;

                var subject = string.Empty;
                switch (string.IsNullOrEmpty(customerLanguage) ? null : customerLanguage.ToUpper())
                {
                    case "FRA":
                        subject = "Portail Client ScentAir : Notification de Facture";
                        break;
                    case "SPA":
                        subject = "Portal de Clientes ScentAir - Notificación de Facturas";
                        break;
                    case "DUT":
                        subject = "ScentAir Account Centrum - Factuur Notificatie";
                        break;
                    default:
                        subject = "ScentAir Account Center – Invoice Notification";
                        break;
                }



                //Calculate Total Account Balance

                var accountBalance = portalContext.Invoices
                    .Where(w => w.BilledToAccountNumber == accountNumber)
                    .Sum(s => s.Balance);

                string emailMessage = emailContent
                                     .Replace("{BilledToAccountNumber}", accountNumber)
                                     .Replace("{DateDue}", dateDue)
                                     .Replace("{Balance}", balance)
                                     .Replace("{AccountBalance}", accountBalance.ToString())
                                     .Replace("{BalanceCurrency}", balanceCurrency);

                logger.LogInformation($"Invoice notification email Sent to {userProfile.FirstName} {userProfile.LastName} at {userProfile.Email} : Customer  number {accountNumber} ");

                return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, emailMessage, true);
            }

            logger.LogInformation($"User profile not found for invoice notification ");
            return new Impl.TaskResultBuilder { { "email", "User Profile not found." } }.Fail();
        }

        public async Task<ITaskResult> SendEmailAsync(
           MailboxAddress sender,
           MailboxAddress[] recipients,
           string subject,
           string body,
           bool isHtml = true)
        {
            if (smtpConfig.UseSendGridEmail)
            {
                return await SendGridEmailAsync(sender, recipients, subject, body, isHtml);
            }

            var msg = null as string;
            var message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recipients);
            var bccAddress = new MailboxAddress("No Reply", "no-reply@scentair.com");
            message.Bcc.AddRange(new MailboxAddress[] { bccAddress });
            message.Subject = subject;
            message.Body = isHtml ? new BodyBuilder { HtmlBody = body }.ToMessageBody() : new TextPart("plain") { Text = body };

            try
            {
                if (!smtpConfig.Disabled)
                    using (var client = new SmtpClient())
                    {
                        //if (config.UseSSL)
                        client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;
                        await client.ConnectAsync(smtpConfig.Host, smtpConfig.Port, smtpConfig.UseSSL).ConfigureAwait(false);
                        client.AuthenticationMechanisms.Remove("XOAUTH2");
                        if (!string.IsNullOrWhiteSpace(smtpConfig.Username))
                            await client.AuthenticateAsync(smtpConfig.Username, smtpConfig.Password).ConfigureAwait(false);
                        await client.SendAsync(message).ConfigureAwait(false);
                        await client.DisconnectAsync(true).ConfigureAwait(false);
                    }
                logger.LogInformation($"Email Sent Successful");

                return Impl.TaskResultBuilder.Successful();
            }
            catch (ServiceNotAuthenticatedException ex)
            {
                msg = "Not authenticated for the email server";
                logger.LogError(ex, "Not authenticated for the email server");
            }
            catch (ServiceNotConnectedException ex)
            {
                msg = "Could not connect to the email server";
                logger.LogError(ex, "Could not connect to the email server");
            }
            catch (ProtocolException ex)
            {
                msg = "Handshake failed to the email server";
                logger.LogError(ex, "Handshake failed to the email server");
            }
            catch (IOException ex)
            {
                msg = "IO failed to email server";
                logger.LogError(ex, "IO failed to email server");
            }
            catch (SocketException ex)
            {
                msg = "Socket failed to email server";
                logger.LogError(ex, "Socket failed to email server");
            }
            catch (Exception ex)
            {
                msg = "An error occurred while sending email";
                logger.LogError(ex, "An error occurred while sending email");
            }
            return new Impl.TaskResultBuilder { { "email", msg } }.Fail();
        }

        public async Task<ITaskResult> SendGridEmailAsync(
           MailboxAddress sender,
           MailboxAddress[] recipients,
           string subject,
           string body,
           bool isHtml = true)
        {
            var msg = null as string;

            var sgclient = new SendGrid.SendGridClient(smtpConfig.SendGridEmailApiKey);
            var sgmsg = new SendGrid.Helpers.Mail.SendGridMessage();
            sgmsg.From = new SendGrid.Helpers.Mail.EmailAddress(sender.Address, sender.Name);
            foreach (MailboxAddress to in recipients)
            {
                sgmsg.AddTo(to.Address, to.Name);
            }
            sgmsg.Subject = subject;
            var content = new SendGrid.Helpers.Mail.Content(isHtml ? "text/html" : "text/plain", body);
            sgmsg.Contents = new List<SendGrid.Helpers.Mail.Content>(new[] { content });

            try
            {
                var sgres = await sgclient.SendEmailAsync(sgmsg);
                if (sgres.StatusCode == System.Net.HttpStatusCode.Accepted)
                {
                    return Impl.TaskResultBuilder.Successful();
                }
                else
                {
                    msg = "Email failed to send. Reason: " + sgres.StatusCode.ToString();
                    return new Impl.TaskResultBuilder { { "email", msg } }.Fail();
                }
            }
            catch (Exception ex)
            {
                msg = "An error occurred while sending email";
                logger.LogError(ex, "An error occurred while sending email");
            }
            return new Impl.TaskResultBuilder { { "email", msg } }.Fail();
        }

    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment.Impl
{
    public class ImportManager : IImportManager, IDisposable
    {
        private readonly CancellationTokenSource cancellationTokenSource;
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<ImportManager> logger;
        private readonly Dictionary<string, ImportTask> runningTasks;


        public string InvoiceNotificationEmailContent { get; set; }

        public ImportManager(IServiceProvider serviceProvider, ILoggerFactory loggerFactory)
        {
            this.cancellationTokenSource = new CancellationTokenSource();
            this.serviceProvider = serviceProvider;
            this.logger = loggerFactory.CreateLogger<ImportManager>();

            this.runningTasks = new Dictionary<string, ImportTask>();
        }

        public void Import(string accountNumber)
        {
            if (!this.runningTasks.ContainsKey(accountNumber))
                lock (this.runningTasks)
                    if (!this.runningTasks.ContainsKey(accountNumber))
                    {
                        logger.LogDebug($"Creating Import Task for Customer : {accountNumber}");

                        var importTask = new ImportTask(serviceProvider, cancellationTokenSource.Token, accountNumber, InvoiceNotificationEmailContent);

                        this.runningTasks.Add(accountNumber, importTask);

                        importTask.Task.ContinueWith(t =>
                        {
                            logger.LogDebug($"Import Task for  Customer : {accountNumber} = {t.Status.ToString()}");

                            removeTask(accountNumber);

                        }, TaskContinuationOptions.NotOnFaulted);

                        importTask.Task.ContinueWith(t =>
                        {
                            logger.LogError(t.Exception, $"Import Task for  Customer : {accountNumber} Created Exception {t.Exception.Message}");

                            removeTask(accountNumber);

                        }, TaskContinuationOptions.OnlyOnFaulted);



                        logger.LogDebug($"Starting Import Task for  Customer : {accountNumber}");

                        importTask.Start();
                    }
        }

        private void removeTask(string accountNumber)
        {
            var task = null as ImportTask;

            if (this.runningTasks.ContainsKey(accountNumber))
                lock (this.runningTasks)
                    if (this.runningTasks.ContainsKey(accountNumber))
                    {
                        logger.LogDebug($"Removing Import Task for {accountNumber}");

                        task = this.runningTasks[accountNumber];
                        this.runningTasks.Remove(accountNumber);

                        logger.LogDebug($"Removed Import Task for {accountNumber}");
                    }

            if (task != null)
                try
                {
                    task.Dispose();
                }
                catch (Exception) { }
        }

        public void Dispose()
        {
            try { this.cancellationTokenSource.Cancel(); } catch { }
            try { this.cancellationTokenSource.Dispose(); } catch { }

            foreach (var item in runningTasks.Values)
                try { item.Dispose(); } catch { }

            this.runningTasks.Clear();
        }


        private sealed class ImportTask : IDisposable
        {
            private readonly IServiceProvider serviceProvider;
            private readonly ILogger<ImportTask> logger;
            private readonly CancellationToken token;
            private readonly string accountNumber;
            private readonly string invoiceNotificationEmailContent;
            public Task Task { get; private set; }

            public ImportTask(IServiceProvider serviceProvider, CancellationToken token, string accountNumber, string invoiceNotificationEmailContent)
            {
                this.serviceProvider = serviceProvider;
                var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
                this.logger = loggerFactory.CreateLogger<ImportTask>();

                this.token = token;
                this.accountNumber = accountNumber;
                this.invoiceNotificationEmailContent = invoiceNotificationEmailContent;
                logger.LogDebug($"In Import Task {accountNumber}");
                this.Task = createTask();
            }


            public void Start() => this.Task.Start();

            private IServiceScope createScope() => serviceProvider.CreateScope();
            private (PortalDbContext portal, X3DbContext x3) getContexts(IServiceScope scope, bool portal = true, bool x3 = true)
            {
                return (
                    scope.ServiceProvider.GetRequiredService<PortalDbContext>(),
                    scope.ServiceProvider.GetRequiredService<X3DbContext>()
                );
            }
            private IAccountManager getAccountManager(IServiceScope scope) => scope.ServiceProvider.GetRequiredService<IAccountManager>();

            private async Task<IList<string>> getInvoiceNumbers(CancellationToken cancellationToken)
            {
                var importedInvoices = null as Dictionary<string, byte[]>;
                var savedInvoices = null as Dictionary<string, byte[]>;
                var result = null as IList<string>;

                using (var scope = createScope())
                {
                    var (portal, x3) = getContexts(scope);

                    logger.LogTrace($"{accountNumber}: retrieving invoice identifiers from x3 db...");

                    logger.LogDebug($" Customer {accountNumber}: retrieving invoice identifiers from x3 db...");

                    importedInvoices = await x3
                        .InvoiceHeaders
                        .Where(x => x.BillToCustomer == accountNumber)
                        .Select(x => new { x.Number, x.RowVersion })
                        .ToDictionaryAsync(x => x.Number, x => x.RowVersion, cancellationToken)
                        ?? new Dictionary<string, byte[]>();

                    logger.LogTrace($"{accountNumber}: retrieved {importedInvoices.Count} invoice identifiers from x3 db.");
                    logger.LogTrace($"{accountNumber}: retrieving invoice identifiers from portal db...");

                    logger.LogDebug($"{accountNumber}: retrieved {importedInvoices.Count} invoice identifiers from x3 db.");

                    savedInvoices = await portal
                        .Invoices
                        .Where(x => x.BilledToAccount.Number == accountNumber)
                        .Select(x => new { x.InvoiceNumber, x.ExternalRowVersion1 })
                        .ToDictionaryAsync(x => x.InvoiceNumber, x => x.ExternalRowVersion1, cancellationToken)
                        ?? new Dictionary<string, byte[]>();

                    logger.LogTrace($"{accountNumber}: retrieved {importedInvoices.Count} invoice identifiers from portal db.");



                    if (importedInvoices.Count == 0)
                    {
                        logger.LogInformation($"{accountNumber}: No Invoices found in X3 db to import.");
                        // return new string[0];
                    }
                    if (savedInvoices.Count == 0)
                        logger.LogDebug($"{accountNumber}: No Invoices found in Portal db compare.");

                    result = importedInvoices
                        .Where(kv => !savedInvoices.ContainsKey(kv.Key) ||
                                     savedInvoices[kv.Key].AreDifferent(kv.Value))
                        .Select(kv => kv.Key)
                        .ToList();

                    logger.LogInformation($"{accountNumber}: returning {result.Count} invoices to import...");
                }
                // result.Add("INV1110312872");
                return result;
            }

            private void importInvoice(Models.X3.Invoice source)
            {
                Task.Run(async () =>
                {
                    logger.LogDebug($"{accountNumber}: importing invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}...");

                    using (var scope = createScope())
                    {
                        var accountManager = getAccountManager(scope);


                        var IsInvoiceExistInDb = await accountManager.GetInvoiceAsync(accountNumber, source.Number);

                        //no database interaction
                        logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: getting addresses...");
                        var addresses = getAddresses(source);

                        //no database interaction
                        logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: getting entities...");
                        var entities = getEntities(source, addresses);


                        var seller = entities.accounting;
                        var acctng = entities.accounting;
                        // Author : Vinod Patil (PIP) , Purpose : Included Company's wire and Ach details
                        var accountingWireAchDetails = entities.accontingWireAchDetails;
                        var billTo = entities.billTo;
                        var soldTo = entities.soldTo;


                        if (entities.seller != null)
                        {
                            logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: importing seller {seller.Number}:{seller.Name}....");

                            seller = await accountManager.SaveCompanyAsync(entities.accounting, token);
                        }



                        if (acctng != null)
                        {
                            logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: importing accounting {acctng.Number}:{acctng.Name}....");

                            //acctng = await accountManager.SaveCompanyAsync(entities.accounting, token);
                            acctng = seller;
                        }



                        if (billTo != null)
                        {
                            logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: importing buyer {billTo.Number}:{billTo.Name}....");

                            billTo = await accountManager.SaveAccountAsync(entities.billTo, token);
                        }



                        if (soldTo != null)
                        {
                            logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: importing receiver {soldTo.Number}:{soldTo.Name}....");

                            //soldTo = await accountManager.SaveAccountAsync(entities.soldTo, token);
                            soldTo = billTo;
                        }

                        logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: importing invoice...");

                        var invoice = createInvoice(source, (seller, acctng, billTo, soldTo));



                        await accountManager.SaveInvoiceAsync(invoice, token);

                        // Author : Vinod Patil (PIP) , Purpose : Included Invoice header details
                        var invoiceHeaderAdditionalDetails = CreateHeaderAdditionalDetails(source);

                        if (invoiceHeaderAdditionalDetails != null)
                        {
                            await accountManager.SaveInvoicHeaderAdditionalDetailsAsync(invoiceHeaderAdditionalDetails, token);

                        }

                        // Author : Vinod Patil (PIP) , Purpose : Included Company's wire and Ach details
                        if (accountingWireAchDetails != null)
                        {
                            logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: importing buyer's Wire And ACH details {billTo.Number}:{billTo.Name}....");
                            accountingWireAchDetails = await accountManager.SaveCompanyWireAchDetailsAsync(entities.accontingWireAchDetails, acctng, token);
                        }

                        // Double check the Invoice Details populated 
                        invoice = CheckInvoiceDetailsImported(invoice);


                        logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: imported invoice.");

                        // Send an email to Customer as part of notification
                        logger.LogDebug($"{accountNumber}: invoice {source.Number} customer {source.BillToCustomer}:{source.BillToName}: imported invoice.");


                        //Send the notification when the invoice is added AFTER they have registered - Keep 1 Hr threshold time
                        var accountProfile = await accountManager.GetAccountAsync(accountNumber, token);

                        if (accountProfile != null)
                        {

                            if (DateTimeOffset.UtcNow.AddHours(-1) > accountProfile.CreatedOn.ToUniversalTime())
                            {
                                if (IsInvoiceExistInDb == null)
                                {
                                   
                                        logger.LogDebug($"{accountNumber}: invoice {source.Number} is a new invoice, so sending invoice notification to customer");
                                        var emailResult = accountManager.SendInvoiceNotification(invoiceNotificationEmailContent, accountNumber, invoice.DateDue.Value.ToString("dd MMM yyyy"), $"{invoice.Balance} {invoice.BalanceCurrency}", invoice.BalanceCurrency);
                                  
                                      //  logger.LogDebug("Email Not Sending!");


                                }
                            }
                        }

                    }


                }).Wait(token);
            }

            private Invoice CheckInvoiceDetailsImported(Invoice invoice)
            {

                var scope = createScope();
                {
                    var (portal, x3) = getContexts(scope, false);

                    try
                    {
                        var invoiceDetails = x3
                            .InvoiceDetails
                            .Where(x => x.InvoiceNumber == invoice.InvoiceNumber).ToList();

                        if (invoice.Details.Count == invoiceDetails.Count)
                        {
                            logger.LogInformation($"Invoice Number {invoice.InvoiceNumber} details are imported correctly!");
                            return invoice;
                        }

                        // Check Whether Invoice details populated already
                        if (invoice.Details.Count == 0 && invoiceDetails.Count() > 0)
                        {
                            logger.LogInformation($"WARNING! Invoice Number {invoice.InvoiceNumber} details are not imported correctly!");

                            foreach (var item in invoiceDetails)
                            {
                                var objDetails = new InvoiceDetail
                                {
                                    ExternalRowVersion = item.RowVersion,
                                    InvoiceNumber = item.InvoiceNumber,
                                    LineNumber = item.LineNumber,
                                    Item = item.Item,
                                    Description = item.Description,
                                    ExtraAmount = item.Total ?? 0,
                                    Discount = 0,
                                    UnitDiscount = 0,
                                    UnitPrice = item.UnitPrice,
                                    Quantity = item.Quantity,
                                    LineTaxRate = item.LineTaxRate ?? 0
                                };
                                invoice.Details.Add(objDetails);
                            }
                        }

                    }
                    catch (Exception e)
                    {
                        logger.LogTrace(e.InnerException.ToString());
                    }

                    logger.LogInformation($"Now. Invoice Number {invoice.InvoiceNumber} details included into Portal DB");
                }

                return invoice;

            }

            private async Task<Models.X3.Invoice> getInvoiceX3(string num, CancellationToken cancellationToken)
            {
                var x3invoice = null as Models.X3.Invoice;

                var scope = createScope();
                {
                    var (portal, x3) = getContexts(scope, false);
                    var accountManager = getAccountManager(scope);

                    logger.LogTrace($"{accountNumber}: getting invoice {num} from x3 db");

                    logger.LogDebug($"{accountNumber}: getting invoice {num} from x3 db");

                    try
                    {
                        x3invoice = await x3
                            .InvoiceHeaders
                            .Where(x => x.Number == num)
                            .Include(x => x.SoldTo)
                            .Include(x => x.BillTo)
                            .Include(x => x.InvoiceDetails)
                            .Include(x => x.InvoiceTaxes)
                            .FirstOrDefaultAsync(cancellationToken);
                    }
                    catch (Exception e)
                    {
                        logger.LogTrace(e.InnerException.ToString());
                        logger.LogDebug(e.InnerException.ToString());
                    }

                    logger.LogTrace($"{accountNumber}: retrieved invoice {num} from x3 db");
                }

                if (x3invoice == null)
                {
                    logger.LogTrace($"Attension HERE : Customer  {accountNumber}: retrieved NULL Object of invoice no. {num} from x3 db");
                }

                return x3invoice;
            }


            private (Address seller, Address accounting, Address billTo, Address shipTo, Address soldTo) getAddresses(Models.X3.Invoice x3invoice)
            {
                var billToAddress = new Address
                {
                    Line1 = x3invoice.BillToAddress1,
                    Line2 = x3invoice.BillToAddress2,
                    Line3 = x3invoice.BillToAddress3,
                    Municipality = x3invoice.BillToCity,
                    StateOrProvince = x3invoice.BillToState,
                    Country = x3invoice.BillToCountry,
                    PostalCode = x3invoice.BillToPostalCode,
                };
                var shippedToAddress = new Address
                {
                    Line1 = x3invoice.ShipToAddress1,
                    Line2 = x3invoice.ShipToAddress2,
                    Line3 = x3invoice.ShipToAddress3,
                    Municipality = x3invoice.ShipToCity,
                    StateOrProvince = x3invoice.ShipToState,
                    Country = x3invoice.ShipToCountry,
                    PostalCode = x3invoice.ShipToPostal,
                };
                var sellerAddress = new Address
                {
                    Line1 = x3invoice.Address1,
                    Line2 = x3invoice.Address2,
                    Line3 = x3invoice.Address3,
                    Municipality = x3invoice.City,
                    StateOrProvince = x3invoice.State,
                    Country = x3invoice.Country ?? " ",
                    PostalCode = x3invoice.PostalCode
                };

                var accountingAddress = new Address
                {
                    Line1 = x3invoice.RemitAddress1 ?? " ",
                    Line2 = x3invoice.RemitAddress2,
                    Line3 = x3invoice.RemitAddress3,
                    Municipality = x3invoice.RemitCity ?? " ",
                    StateOrProvince = x3invoice.RemitState ?? " ",
                    Country = x3invoice.RemitCountry ?? " ",
                    PostalCode = x3invoice.RemitPostalCode ?? " "
                };


                var soldToAddress = null as Address;
                var x3soldTo = x3invoice.SoldTo;
                if (x3soldTo != null)
                {
                    soldToAddress = new Address
                    {
                        Line1 = x3soldTo.Address1,
                        Line2 = x3soldTo.Address2,
                        Line3 = x3soldTo.Address3,
                        Municipality = x3soldTo.City,
                        StateOrProvince = x3soldTo.State,
                        Country = x3soldTo.Country ?? " ",
                        PostalCode = x3soldTo.PostalCode,
                    };
                }

                return (sellerAddress, accountingAddress, billToAddress, shippedToAddress, soldToAddress);
            }
            private (Company seller, Company accounting, CompanyWireAchDetail accontingWireAchDetails, Account billTo, Account shipTo, Account soldTo) getEntities(Models.X3.Invoice x3invoice, (Address seller, Address accounting, Address billTo, Address shipTo, Address soldTo) addresses)
            {
                var seller = new Company
                {
                    ExternalRowVersion = x3invoice.RowVersion,
                    Name = x3invoice.CompanyName,
                    PhysicalAddress = addresses.seller,
                    PhoneNumber = x3invoice.Phone,
                    FaxNumber = x3invoice.Fax,
                    Email = x3invoice.Email,
                };

                var accounting = new Company
                {
                    ExternalRowVersion = x3invoice.RowVersion,
                    Name = x3invoice.CompanyName,
                    BillingAddress = addresses.accounting,
                    Currency = x3invoice.RemitCurrency ?? "UNK", //? x3invoice.Wireroutingcur
                    PhysicalAddress = addresses.seller,
                    MailingAddress = addresses.accounting,
                    ShippingAddress = addresses.accounting,
                    //changed to remit name because there seems to be more data.
                    WireName = x3invoice.RemitName,
                    WireAccountNumber = x3invoice.WireAccountNumber,
                    WireRoutingNumber = x3invoice.WireRoutingNumber,
                    WireBank = x3invoice.WireBank,
                    WireBranch = x3invoice.WireBranch,
                    Email = x3invoice.Email,
                    PhoneNumber = x3invoice.Phone,
                    FaxNumber = x3invoice.Fax,
                    KvkNumber = x3invoice.KvkNumber,
                    TaxId = x3invoice.TaxID,
                    TaxIdPrefix = x3invoice.TaxIdPrefix
                };


                var accountingWireAchDetails = new CompanyWireAchDetail
                {
                    ExternalRowVersion = x3invoice.RowVersion,
                    InvoiceNumber = x3invoice.Number,
                    WireBankId = x3invoice.WireBankId,
                    RemitSortcode = x3invoice.RemitSortCode,
                    RemitBan = x3invoice.RemitIBanNumber,
                    SwiftName = x3invoice.SwiftName,
                    Swift = x3invoice.Swift,
                    WireCurrency = x3invoice.WireCurrency,
                    WireName2 = x3invoice.WireName2,
                    WireBank2 = x3invoice.WireBankName2,
                    WireAccount2 = x3invoice.WireAccount2,
                    Swift2 = x3invoice.Swift2,
                    WireCurrency2 = x3invoice.WireCurrency2,
                    WireClearing = x3invoice.WireClearing,
                    WireAccountNumber = x3invoice.WireAccountNumber,
                    WireBank = x3invoice.WireBank,
                    WireName = x3invoice.WireName,
                    WireBranch = x3invoice.WireBranch,
                    WireRoutingNumber = x3invoice.WireRoutingNumber


                };


                var billTo = new Account
                {
                    ExternalRowVersion = x3invoice.RowVersion,
                    Number = x3invoice.BillToCustomer,
                    Name = x3invoice.BillToName,
                    BillingAddress = addresses.billTo,
                    ShippingAddress = addresses.shipTo,
                    PhysicalAddress = addresses.soldTo,
                    Language = x3invoice.BillTo?.Language,
                    TaxId = x3invoice.CustomerTaxId,
                    TaxPrefix = x3invoice.CustomerTaxPrefix
                };


                var shipTo = null as Account;
                if (!string.Equals(x3invoice.ShipToName, x3invoice.BillToName, StringComparison.OrdinalIgnoreCase))
                {
                    logger.LogWarning($"{accountNumber}: unknown entity {x3invoice.ShipToName}.  does not match {x3invoice.BillToName}");
                }
                else
                {
                    billTo.ShippingAddress = addresses.shipTo;
                }
                var soldTo = null as Account;
                if (!string.IsNullOrWhiteSpace(x3invoice.SoldToCustomer))
                {
                    if (!string.Equals(x3invoice.SoldToCustomer, x3invoice.BillToCustomer, StringComparison.OrdinalIgnoreCase))
                    {
                        logger.LogWarning($"{accountNumber}: sold to {x3invoice.SoldToCustomer} does not match {x3invoice.BillToCustomer}.");
                    }
                    else
                    {
                        billTo.PhysicalAddress = addresses.soldTo;
                        soldTo = billTo;
                    }
                }
                //changed to ensure it's setup correctly shouldn't really be needed.
                soldTo = billTo;

                return (seller, accounting, accountingWireAchDetails, billTo, shipTo, soldTo);
            }
            private Invoice createInvoice(Models.X3.Invoice x3invoice, (Company seller, Company acctng, Account billTo, Account soldTo) entities)
            {
                return new Invoice
                {
                    SellingEntity = entities.seller,
                    BillingEntity = entities.acctng,
                    BilledToAccount = entities.billTo,
                    SoldToAccount = entities.soldTo,

                    InvoiceNumber = x3invoice.Number,
                    ExternalRowVersion = x3invoice.RowVersion,
                    ExternalRowVersion1 = x3invoice.RowVersion,

                    IncoTerms = x3invoice.Incoterms,
                    Currency = x3invoice.Currency,
                    CustomerPurchaseOrderNumber = x3invoice.CustomerPO,
                    CustomerReferenceNumber = x3invoice.CustomerReferenceNumber,
                    Comments = x3invoice.Memo,

                    InvoiceDate = x3invoice.Date,

                    ServiceFrom = x3invoice.StartDate,
                    ServiceTo = x3invoice.DetEndDate,

                    PaymentTerms = x3invoice.Payterms,
                    DateDue = x3invoice.DateDue,

                    ShippingMethod = x3invoice.ShipVia,
                    ShippingAddress = entities.billTo?.ShippingAddress ?? entities.soldTo?.ShippingAddress,
                    //ShippingNumber
                    //ShippingResult

                    DiscountAmount = 0,
                    SubTotalAmount = x3invoice.Subtotal ?? 0,
                    TaxId = x3invoice.TaxID,
                    TaxRate = x3invoice.TaxRate ?? 0,
                    TaxAmount = x3invoice.TaxAmount ?? 0,
                    Balance = x3invoice.Balance ?? 0,
                    BalanceCurrency = x3invoice.BalanceCurrency,
                    Total = x3invoice.PaidAmount ?? 0,

                    Details = x3invoice
                        .InvoiceDetails
                        .Select(x => new InvoiceDetail
                        {
                            ExternalRowVersion = x.RowVersion,
                            InvoiceNumber = x.InvoiceNumber,
                            LineNumber = x.LineNumber,
                            Item = x.Item,
                            Description = x.Description,
                            ExtraAmount = x.Total ?? 0,
                            Discount = 0,
                            UnitDiscount = 0,
                            UnitPrice = x.UnitPrice,
                            Quantity = x.Quantity,
                            LineTaxRate = x.LineTaxRate ?? 0
                        })
                        .ToArray(),

                    Taxes = x3invoice
                        .InvoiceTaxes
                        .Select(x => new InvoiceTax
                        {
                            BPR = x.BPR,
                            InvoiceNumber = x.InvoiceNumber,
                            TaxAmount = x.TaxAmt ?? 0,
                            TaxDesc = x.TaxDesc,
                        })
                        .ToArray()
                };
            }


            private InvoiceHeaderExtension CreateHeaderAdditionalDetails(Models.X3.Invoice x3invoice)
            {
                return new InvoiceHeaderExtension
                {
                    InvoiceNumber = x3invoice.Number,
                    ExternalRowVersion = x3invoice.RowVersion,
                    Logo = x3invoice.Logo,
                    DocType = x3invoice.DocType,
                    InvoiceCurrency = x3invoice.Currency,
                    Memo = x3invoice.Memo,
                    PdcrAmount = x3invoice.PDCRAmount,
                    PaymentReference = x3invoice.PayRef,
                    CheckNumber = x3invoice.CheckNumber,
                    PayAmount = x3invoice.PayAmount,
                    ImporteTOT = x3invoice.ImportETotal,
                    PayByCustomer = x3invoice.PayByCustomer,
                    PayByName = x3invoice.PayByCustomerName,
                    CPY = x3invoice.Cpy,
                    BillToName = x3invoice.BillToName,
                    ShipToName = x3invoice.ShipToName,
                    RemitName = x3invoice.RemitName,
                    RemitCurrency = x3invoice.RemitCurrency,
                    CustTaxPrefix = x3invoice.CustomerTaxPrefix,
                    CustTaxId = x3invoice.CustomerTaxId,
                    PayByAddress = new Address
                    {
                        Line1 = x3invoice.PayByCustomerAdd1,
                        Line2 = x3invoice.PayByCustomerAdd2,
                        Line3 = x3invoice.PayByCustomerAdd3,
                        PostalCode = x3invoice.PayByCustomerZip,
                        StateOrProvince = x3invoice.PayByCustomerCityState,
                        Municipality = x3invoice.PayByCustomerCityState,
                    },
                    RemitAddress = new Address
                    {
                        Line1 = x3invoice.RemitAddress1,
                        Line2 = x3invoice.RemitAddress2,
                        Line3 = x3invoice.RemitAddress3,
                        PostalCode = x3invoice.RemitPostalCode,
                        StateOrProvince = x3invoice.RemitState,
                        Municipality = x3invoice.RemitCity,
                        Country = x3invoice.RemitCountry
                    },
                    BillToAddress = new Address
                    {
                        Line1 = x3invoice.BillToAddress1,
                        Line2 = x3invoice.BillToAddress2,
                        Line3 = x3invoice.BillToAddress3,
                        Municipality = x3invoice.BillToCity,
                        StateOrProvince = x3invoice.BillToState,
                        Country = x3invoice.BillToCountry,
                        PostalCode = x3invoice.BillToPostalCode
                    },
                    ShipToAddress = new Address
                    {
                        Line1 = x3invoice.ShipToAddress1,
                        Line2 = x3invoice.ShipToAddress2,
                        Line3 = x3invoice.ShipToAddress3,
                        Municipality = x3invoice.ShipToCity,
                        StateOrProvince = x3invoice.ShipToState,
                        Country = x3invoice.ShipToCountry,
                        PostalCode = x3invoice.ShipToPostal,
                    }
                };

            }



            private Task createTask()
            {
                logger.LogDebug($"In Create Task");

                return new Task(() =>
                {
                    var invoiceNumbers = getInvoiceNumbers(token).Result;

                    logger.LogInformation($"Customer : {accountNumber}: getting {invoiceNumbers.Count} invoices from x3 db...");

                    logger.LogDebug($"Customer : {accountNumber}: getting {invoiceNumbers.Count} invoices from x3 db...");

                    var retrieval = invoiceNumbers.Select(x => getInvoiceX3(x, token)).ToArray();


                    Task.WhenAll(retrieval).Wait(token);

                    logger.LogInformation($"{accountNumber}: retrieved {retrieval.Length} invoices from x3 db");


                    logger.LogInformation($"{accountNumber}: importing invoices from x3 db...");

                    //possibly create account here.

                    var invoices = retrieval.Select(x => x.Result);
                    foreach (var invoice in invoices)
                    {
                        if (invoice != null)
                        {
                            importInvoice(invoice);

                        }
                        else
                        {
                            logger.LogInformation($"Customer : {accountNumber}: facing DATA ISSUE in PortalDB, May be chances that BillTo Or CustTo Info not available.");
                        }


                    }

                    logger.LogInformation($"{accountNumber}: imported invoices from x3 db");

                }, token);
            }

            public void Dispose()
            {
                try { this.Task?.Dispose(); } catch { }
            }





        }
    }
}

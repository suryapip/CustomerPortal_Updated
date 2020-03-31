using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.WindowsServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ScentAir.Payment.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Threading.Tasks;

namespace ScentAir.Payment
{
    internal class Host : WebHostService
    {
        private readonly IServiceProvider services;
        private readonly IConfiguration configuration;
        //  private readonly ILogger<Host> Log;
        private readonly ILogger Log;

        private readonly IDictionary<string, DateTime> lastImport;
        //  private TimeSpan importInterval;
        //   private TimeSpan paymentInterval;
        private IServiceScope serviceScope;
        private IImportManager importManager;
        private DateTime lastLookupEvent;
        private DateTime lastPaymentEvent;
        private TimeSpan lookupInterval;
        private bool importEnabled;
        private bool autoPayEnabled;
        static IHostingEnvironment _hostingEnvironment;

        public Host(IWebHost host) : base(host)
        {
            this.services = host.Services;
            this.configuration = services.GetRequiredService<IConfiguration>();

            this.Log = services.GetService<ILoggerFactory>()
             .AddLog4Net()
             .CreateLogger<Program>();

            this.Log.LogInformation("Initializing...");

            this.lastImport = new ConcurrentDictionary<string, DateTime>();

        }

        public void Start(string[] args)
        {
            OnStarting(args);
            OnStarted();
            Console.WriteLine("Job Started for " + args[0]);
            switch (args[0])
            {
                case "Import":
                    _ = LastImportDetails();
                    break;
                case "Autopayprocess":
                    _ = PaymentDetails();
                    break;
            }
        }

        protected override void OnStarting(string[] args)
        {

            this.Log.LogInformation("Creating services...");

            this.serviceScope = services.CreateScope();

            this.importManager = serviceScope.ServiceProvider.GetRequiredService<IImportManager>();
        }

        private async Task LastImportDetails()
        {
            try
            {
                //new SP imple code start from here
                newImportDetails();
            }
            catch (Exception ex)
            {
                using (var scope = services.CreateScope())
                {
                    var Subject = "";
                    if (_hostingEnvironment.IsDevelopment())
                    {
                        Subject = "Test: No Customer found to import inovice" + DateTime.Now.ToString();
                    }
                    else
                    {
                        Subject = "Prod: No Customer found to import inovice" + DateTime.Now.ToString();
                    }
                    var accountManager = scope.ServiceProvider.GetService<IAccountManager>();
                    var configAutoPayFailedEmailId = configuration.GetValue<string>(Constants.Configuration.Options.importAccountCustFailedEmailId);
                    var emailsentResult = await accountManager.SendEmailAsync("Support Team", configAutoPayFailedEmailId, Subject,
                    GetAutoPaymentFailedSupportEmail(), "", "", ex.Message.ToString());
                    Log.LogError(ex, "Retrieving  Account Customers ...failed");

                    Environment.Exit(0);
                }
            }
        }

        #region Portal DB Insert
        private void newImportDetails()
        {
            try
            {
                var connectiondb = configuration["ConnectionStrings:Portal"];

                //1.Get customers
                SqlConnection conportal = new SqlConnection(connectiondb);
                SqlCommand cmdCustomer = new SqlCommand("Get_All_Eligible_Customer_Invoices_For_Insert", conportal);
                cmdCustomer.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter daInvoice = new SqlDataAdapter(cmdCustomer);
                DataTable dtCustomer = new DataTable();
                conportal.Open();
                daInvoice.Fill(dtCustomer);
                Log.LogInformation(dtCustomer.Rows.Count, "Account Customers Retrieved  ");

                DataTable dtInvoice = new DataTable();
                SqlCommand cmdInvoice = new SqlCommand("[SP_INSERTINVOICEDATA]", conportal);
                cmdInvoice.CommandType = CommandType.StoredProcedure;
                cmdInvoice.Parameters.Add("@ACCOUNTNUMBER", SqlDbType.NVarChar);
                cmdInvoice.Parameters.Add("@INVOICENUMBER", SqlDbType.NVarChar);

                foreach (DataRow customer in dtCustomer.Rows)
                {
                    var customerId = customer["CustomerNumber"].ToString();
                    cmdInvoice.Parameters["@ACCOUNTNUMBER"].Value = customerId;

                    var invoiceId = customer["InvoiceNumber"].ToString();
                    cmdInvoice.Parameters["@INVOICENUMBER"].Value = invoiceId;

                    if (dtCustomer.Rows.Count > 0)
                    {
                        daInvoice = new SqlDataAdapter(cmdInvoice);
                        dtInvoice = new DataTable();
                        daInvoice.Fill(dtInvoice);

                        Log.LogInformation("Customer {0} invoice {1}  imported sucessfully ", customerId, invoiceId);
                    }
                    var dueDate = customer["DueDate"].ToString();
                    var balance = customer["Balance"].ToString();
                    var balCur = customer["BalCur"].ToString();
                    var subTotal = customer["SUbTotal"].ToString();
                    var Laungage = customer["acc_Lang"].ToString();
                    var Email = customer["Email"].ToString();

                    InvoiceEmailNotifications(customerId, dueDate, balance, subTotal, balCur, Laungage, Email);
                }

                UpdateInvoiceData(connectiondb);

                Log.LogInformation("Database connection closed sucessfully");
                conportal.Close();
            }
            catch (Exception ex)
            {
                Log.LogError(ex,"Runtime Exception: -- ", ex.Message);
                Log.LogError(ex,"Runtime Exception: -- ", ex.StackTrace);
            }
        }

        private void UpdateInvoiceData(string connectiondb)
        {
            SqlConnection updateConportal = new SqlConnection(connectiondb);
            SqlCommand cmdUpdateCustomer = new SqlCommand("SP_UPDATEINVOICEDATA", updateConportal);
            cmdUpdateCustomer.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter daUpdateCustomer = new SqlDataAdapter(cmdUpdateCustomer);
            DataTable dtUpdateCustomer = new DataTable();
            updateConportal.Open();
            daUpdateCustomer.Fill(dtUpdateCustomer);
            if (dtUpdateCustomer.Rows.Count > 0)
                Log.LogInformation(dtUpdateCustomer.Rows.Count, "Customer invoice updated successfully.");
            else
                Log.LogInformation(dtUpdateCustomer.Rows.Count, "No record found for update.");

        }
        #endregion
        //New insert in "Portal" database

        private async void InvoiceEmailNotifications(string CustomerNumber, string DueDate, string Balance, string SUbTotal, string BalCur, string Laungage, string Email)
        {
            using (var scope = services.CreateScope())
            {
                var accountManager = scope.ServiceProvider.GetService<IAccountManager>();
                ApplicationUser user = await accountManager.GetUserAsync(CustomerNumber);
                importManager.InvoiceNotificationEmailContent = GetInvoiceNotificationEmail(Laungage);
                var customerEmailSentResult = await accountManager.SendEmailAsync(user.FullName, Email, "ScentAir Account Center – Invoice Ready for Payment.",
                    GetInvoiceNotificationEmail(Laungage),
                    new KeyValuePair<string, string>[]
                    {
                        new KeyValuePair<string, string>("{BilledToAccountNumber}", CustomerNumber),
                        new KeyValuePair<string, string>("{DateDue}", DueDate),
                        new KeyValuePair<string, string>("{Balance}", Balance),
                        new KeyValuePair<string, string>("{AccountBalance}", SUbTotal),
                        new KeyValuePair<string, string>("{BalanceCurrency}", BalCur),
                    });
            }
        }

        private void ImportDueDetails()
        {
            Log.LogDebug("Calculating accounts to import...starting");

            // Fetch max 20 Customer for each iteration.
            //var importDue = lastImport.Where(kv => kv.Value + importInterval < DateTime.Now).Select(kv => kv.Key).Take(20).ToArray();

            //Removed logic to import 20 at a time as we are not using timer now

            var importDue = lastImport.Where(kv => kv.Value < DateTime.Now).Select(kv => kv.Key).ToArray();

            Log.LogDebug(string.Format("Time : {0} and Total Acocunts to Import : {1}", DateTime.Now.ToString(), importDue.Count()));

            Log.LogDebug("Calculating accounts to import...complete");


            Log.LogDebug("imports...starting");

            foreach (var customer in importDue)
            {

                using (var scope = services.CreateScope())
                {
                    var accountManager = scope.ServiceProvider.GetService<IAccountManager>();

                    var customerLanguae = accountManager.GetAccountLanguage(customer).Result;

                    importManager.InvoiceNotificationEmailContent = GetInvoiceNotificationEmail(customerLanguae);
                }
                //var emailenabled = configuration.GetValue<bool>(Constants.Configuration.Options.emailEnabled, false);

                importManager.Import(customer);

                lastImport[customer] = DateTime.Now;
            }

        }

        private async Task PaymentDetails()
        {
            Log.LogDebug($" Time : {DateTime.Now.ToString()}, Retrieving invoices to pay...starting");

            var customers = null as string[];

            using (var scope = services.CreateScope())
            {
                var accountManager = scope.ServiceProvider.GetService<IAccountManager>();

                var unscheduled = await accountManager.GetUnScheduledInvoicesAsync();

                Log.LogDebug($"Total UnScheduled Invoices : {unscheduled.Count}");

                // Remove Failed Payment invoices
                List<Invoice> invoiceList = new List<Invoice>();
                foreach (var item in unscheduled)
                {
                    var status = item.Payments.Where(w => w.Status == InvoicePaymentStatus.Failed).Count() > 0;
                    if (!status)
                    {
                        Log.LogDebug($" Invoice Number : {item.InvoiceNumber} included for the processing.");
                        invoiceList.Add(item);
                    }
                }

                var byAccount = invoiceList.GroupBy(x => x.BilledToAccountNumber).ToDictionary(g => g.Key, g => g.ToArray());

                Log.LogDebug($"Total Account to be processed : {byAccount.Count}");

                // mholmes testing
                //string accountNumbertest = "1279556";
                //ApplicationUser usertest = await accountManager.GetUserAsync(accountNumbertest);
                //Account accounttest = await accountManager.GetAccountAsync(accountNumbertest);
                //var languagetest = accountManager.GetAccountLanguage(accountNumbertest).Result;
                //string newemailtest = "mholmes@scentair.com";
                //var methodstest = await accountManager.GetPaymentMethodsAsync(accountNumbertest);
                //var methodtest = methodstest?.FirstOrDefault(m => m.IsAuto && !m.IsDisabled && !m.IsDeleted);
                //var cardNumtest = methodtest?.PaymentAccountNumber;
                //var customerEmailSentResulttest = await accountManager.SendEmailAsync(usertest.FullName, newemailtest, "ScentAir Account Center – Auto Payment Failed",
                //    GetAutoPaymentFailedCustomerEmail(languagetest), //, accountNumbertest, "123.00", "This is where the error msg goes");
                //    new KeyValuePair<string, string>[]
                //    {
                //        new KeyValuePair<string, string>("{customerName}", accounttest.Name),
                //        new KeyValuePair<string, string>("{accountNumber}", accounttest.Number),
                //        new KeyValuePair<string, string>("{paymentMethod}", cardNumtest),
                //        new KeyValuePair<string, string>("{amount}", "123.45"),
                //        new KeyValuePair<string, string>("{error}", "This is where the error msg goes"),
                //    });
                //var resulttest = customerEmailSentResulttest.ExecutionResult.ToString();

                foreach (var account in byAccount)
                {
                    try
                    {

                        var invoices = account.Value.Where(i => i.Balance > 0).ToArray();
                        if (invoices.Length == 0)
                        {
                            Log.LogDebug($"Account {account.Key}: skipping. no unscheduled invoices.");
                            continue;
                        }

                        var totalBalance = invoices.Sum(i => i.Balance);

                        if (totalBalance <= 0)
                        {
                            Log.LogDebug($"Account {account.Key}: skipping. total balance: {totalBalance}");
                            continue;
                        }

                        var methods = await accountManager.GetPaymentMethodsAsync(account.Key);


                        var method = methods?.FirstOrDefault(m => m.IsAuto && !m.IsDisabled && !m.IsDeleted);
                        if (method == null)
                        {
                            Log.LogDebug($"Account {account.Key}: skipping. no auto payment methods");
                            continue;
                        }

                        var transactionNumber = await accountManager.BeginPaymentTransactionAsync(method.Id.ToString("N"), totalBalance, invoices.Select(i => i.InvoiceNumber).ToArray()).SafeAsync(Log);
                        if (transactionNumber.IsNullOrWhiteSpace())
                        {
                            Log.LogWarning($"Account {account.Key}: Could not begin payment");
                            continue;
                        }

                        var paymentResult = await accountManager.SubmitPaymentAsync(account.Key, method.Id, transactionNumber, totalBalance, invoices.Select(i => i.InvoiceNumber).ToArray()).SafeAsync(Log);
                        var payment = paymentResult.Result;

                        if (!paymentResult.IsSuccessful || payment.ApprovalStatus != "1")
                        {
                            // Chase Response
                            var chaseResponse = $"Account {account.Key}, Transaction {transactionNumber}: Could not cancel payment. ConfirmationNumber: {payment?.ConfirmationNumber}, ProcessorStatus:{payment?.ProcessorStatus}, ApprovalStatus:{payment?.ApprovalStatus}, Message:{payment?.Message}";

                            var cancel = await accountManager.CancelPaymentTransactionAsync(transactionNumber, chaseResponse, true).SafeAsync(false, Log);
                            if (!cancel)
                            {
                                Log.LogCritical($"Account {account.Key}, Transaction {transactionNumber}: Could not cancel payment. ConfirmationNumber: {payment?.ConfirmationNumber}, ProcessorStatus:{payment?.ProcessorStatus}, ApprovalStatus:{payment?.ApprovalStatus}, Message:{payment?.Message}");

                                continue;
                            }

                            //Email send
                            var failedinvoices = account.Value.Where(i => i.Balance > 0).ToArray();

                            // Email to Support
                            var configAutoPayFailedEmailId = configuration.GetValue<string>(Constants.Configuration.Options.FailedEmailId);
                            var supportEmailSentResult = await accountManager.SendEmailAsync("Support Team", configAutoPayFailedEmailId, "ScentAir Account Center – Auto Payment Failed",
                                GetAutoPaymentFailedSupportEmail(), account.Key, failedinvoices.Sum(i => i.Balance).ToString(),
                                string.IsNullOrEmpty(payment.ProcessorStatus) ? payment.Message : payment.ProcessorStatus);

                            // Email to Customer
                            ApplicationUser user = await accountManager.GetUserAsync(account.Key);
                            Account customerAccount = await accountManager.GetAccountAsync(account.Key);
                            string language = accountManager.GetAccountLanguage(account.Key).Result;
                            var customerEmailSentResult = await accountManager.SendEmailAsync(user.FullName, user.Email, "ScentAir Account Center – Auto Payment Failed",
                                GetAutoPaymentFailedCustomerEmail(language),
                                new KeyValuePair<string, string>[]
                                {
                                    new KeyValuePair<string, string>("{customerName}", customerAccount.Name),
                                    new KeyValuePair<string, string>("{accountNumber}", customerAccount.Number),
                                    new KeyValuePair<string, string>("{paymentMethod}", method?.PaymentAccountNumber),
                                    new KeyValuePair<string, string>("{amount}", failedinvoices.Sum(i => i.Balance).ToString()),
                                    new KeyValuePair<string, string>("{error}", string.IsNullOrEmpty(payment.ProcessorStatus) ? payment.Message : payment.ProcessorStatus),
                                });

                            Log.LogInformation($"Account {account.Key}, Transaction {transactionNumber}: Canceled payment. ConfirmationNumber: {payment?.ConfirmationNumber}, ProcessorStatus:{payment?.ProcessorStatus}, ApprovalStatus: {payment?.ApprovalStatus}, Message: {payment?.Message}, CustomerEmailResult: {customerEmailSentResult.ExecutionResult.ToString()} ({user.Email})");
                        }

                        if (paymentResult.IsSuccessful)
                        {
                            var result = await accountManager.CompletePaymentTransactionAsync(transactionNumber, payment.ConfirmationNumber, payment.ProcessorStatus, payment.ApprovalStatus).SafeAsync(false, Log);
                            if (!result)
                                Log.LogCritical($"Account {account.Key}, Transaction {transactionNumber}: Could not finalize payment. ConfirmationNumber: {payment.ConfirmationNumber}, ProcessorStatus:{payment.ProcessorStatus}, ApprovalStatus:{payment.ApprovalStatus}, Message:{payment?.Message}");

                        }


                    }
                    catch (FaultException ex)
                    {
                        var failedinvoices = account.Value.Where(i => i.Balance > 0).ToArray();
                        var totalBalance = failedinvoices.Sum(i => i.Balance);

                        var configAutoPayFailedEmailId = configuration.GetValue<string>(Constants.Configuration.Options.FailedEmailId);

                        var emailsentResult = await accountManager.SendEmailAsync("Support Team", configAutoPayFailedEmailId, "ScentAir Account Center – Auto Payment Failed",
                            GetAutoPaymentFailedSupportEmail(), account.Key, totalBalance.ToString(), ex.Message.ToString());
                        Log.LogError(ex, "Retrieving invoices to pay...failed");
                    }
                    catch (Exception ex)
                    {
                        var failedinvoices = account.Value.Where(i => i.Balance > 0).ToArray();
                        var totalBalance = failedinvoices.Sum(i => i.Balance);

                        var configAutoPayFailedEmailId = configuration.GetValue<string>(Constants.Configuration.Options.FailedEmailId);

                        var emailsentResult = await accountManager.SendEmailAsync("Support Team", configAutoPayFailedEmailId, "ScentAir Account Center – Auto Payment Failed",
                            GetAutoPaymentFailedSupportEmail(), account.Key, totalBalance.ToString(), ex.Message.ToString());
                        Log.LogError(ex, "Retrieving invoices to pay...failed");

                    }
                }

            }

            Log.LogDebug("Retrieving invoices to pay...complete");
            Environment.Exit(0);
        }

        public static string GetAutoPaymentFailedSupportEmail()
        {
            return readFile("EmailTemplates/AutoPaymentFailedSupportEmail.template");
        }

        public static string GetAutoPaymentFailedCustomerEmail(string language = null)
        {
            var fileName = string.Empty;
            switch (string.IsNullOrEmpty(language) ? null : language.ToUpper())
            {
                // Currently, AutoPay is only available for English language.
                //case "FRA":
                //    fileName = "EmailTemplates/InvoiceNotification-fr.template";
                //    break;
                //case "SPA":
                //    fileName = "EmailTemplates/InvoiceNotification-sp.template";
                //    break;
                //case "DUT":
                //    fileName = "EmailTemplates/InvoiceNotification-de.template";
                //    break;
                default:
                    fileName = "EmailTemplates/AutoPaymentFailedCustomerEmail-en.template";
                    break;
            }

            return readFile(fileName);
        }

        public static string GetInvoiceNotificationEmail(string language)
        {
            var fileName = string.Empty;
            switch (string.IsNullOrEmpty(language) ? null : language.ToUpper())
            {
                case "FRA":
                    fileName = "EmailTemplates/InvoiceNotification-fr.template";
                    break;
                case "SPA":
                    fileName = "EmailTemplates/InvoiceNotification-sp.template";
                    break;
                case "DUT":
                    fileName = "EmailTemplates/InvoiceNotification-de.template";
                    break;
                default:
                    fileName = "EmailTemplates/InvoiceNotification-en.template";
                    break;
            }

            return readFile(fileName);
        }

        public static void UseEnvironment(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        private static string readFile(string path)
        {
            if (_hostingEnvironment == null)
                throw new InvalidOperationException($"{nameof(Host)} is not initialized");

            var fileInfo = _hostingEnvironment.ContentRootFileProvider.GetFileInfo(path);

            if (!fileInfo.Exists)
                throw new FileNotFoundException($"Template file located at \"{path}\" was not found");

            using (var fs = fileInfo.CreateReadStream())
            {
                using (var sr = new StreamReader(fs))
                {
                    return sr.ReadToEnd();
                }
            }
        }

        protected override void OnStarted()
        {
            base.OnStarted();

            this.Log.LogInformation("Started...");
        }
    }
    public static class ServiceHostExtensions
    {
        public static void RunAsServiceHost(this IWebHost host, string[] args)
        {
            var serviceHost = new Host(host);

            serviceHost.Start(args);
            host.Run();
        }
    }
}

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
using System.Timers;
using Timer = System.Timers.Timer;

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
          GetAutoPaymentFailedEmail(), "", "", ex.Message.ToString());
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
        SqlCommand cmdCustomer = new SqlCommand("SP_GETALLELIGIBLECUSTOMERS", conportal);
        cmdCustomer.CommandType = CommandType.StoredProcedure;
        SqlDataAdapter daCustomer = new SqlDataAdapter(cmdCustomer);
        DataTable dtCustomer = new DataTable();
        conportal.Open();
        daCustomer.Fill(dtCustomer);
        Log.LogInformation(dtCustomer.Rows.Count, "Account Customers Retrieved  ");

        //2.Get all invoices customerwise
        SqlCommand cmdCustomerInvoices = new SqlCommand("SP_GETALLINVOICESOFCUSTOMERS", conportal);
        cmdCustomerInvoices.CommandType = CommandType.StoredProcedure;
        cmdCustomerInvoices.Parameters.Add("@ACCOUNTNUMBER", SqlDbType.NVarChar);
        SqlDataAdapter daCustomerInvoices = null;
        DataTable dtCustomerInvoices = new DataTable();

        SqlDataAdapter daInvoice = null;
        DataTable dtInvoice = new DataTable();
        SqlCommand cmdInvoice = new SqlCommand("[SP_INSERTINVOICEDATA]", conportal);
        cmdInvoice.CommandType = CommandType.StoredProcedure;
        cmdInvoice.Parameters.Add("@ACCOUNTNUMBER", SqlDbType.NVarChar);
        cmdInvoice.Parameters.Add("@INVOICENUMBER", SqlDbType.NVarChar);
        foreach (DataRow customer in dtCustomer.Rows)
        {
          var customerId = customer[0].ToString();
          cmdCustomerInvoices.Parameters["@ACCOUNTNUMBER"].Value = customerId;
          daCustomerInvoices = new SqlDataAdapter(cmdCustomerInvoices);
          dtCustomerInvoices = new DataTable();
          daCustomerInvoices.Fill(dtCustomerInvoices);
          Log.LogInformation("Customer {0} have {1} invoices ", customerId, dtCustomerInvoices.Rows.Count);
          if (dtCustomerInvoices.Rows.Count > 0)
          {
            // 3.Get Invoicewise details from X3(PortalDB)
            foreach (DataRow invoice in dtCustomerInvoices.Rows)
            {
              Log.LogInformation("Customer {0} have {1} invoices ", customerId, invoice[0].ToString());
              var invoiceNumber = invoice[0].ToString();
              cmdInvoice.Parameters["@ACCOUNTNUMBER"].Value = customerId;
              cmdInvoice.Parameters["@INVOICENUMBER"].Value = invoiceNumber;
              daInvoice = new SqlDataAdapter(cmdInvoice);
              dtInvoice = new DataTable();
              daInvoice.Fill(dtInvoice);
              Log.LogInformation("Customer {0} have {1} invoice imported sucessfully ", customerId, invoice[0].ToString());
            }
          }
        }
        Log.LogInformation("Database connection closed sucessfully");
        conportal.Close();
      }
      catch (Exception ex)
      {
        Log.LogDebug("Runtime Exception", ex.StackTrace);
      }
    }
    #endregion
    //New insert in "Portal" database



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


                        var method = methods.FirstOrDefault(m => m.IsAuto && !m.IsDisabled && !m.IsDeleted);
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

                            var configAutoPayFailedEmailId = configuration.GetValue<string>(Constants.Configuration.Options.FailedEmailId);

                            var emailsentResult = await accountManager.SendEmailAsync("Support Team", configAutoPayFailedEmailId, "ScentAir Account Center – Auto Payment Failed",
                                GetAutoPaymentFailedEmail(), account.Key, failedinvoices.Sum(i => i.Balance).ToString(), string.IsNullOrEmpty(payment.ProcessorStatus) ? payment.Message : payment.ProcessorStatus);

                            Log.LogInformation($"Account {account.Key}, Transaction {transactionNumber}: Canceled payment. ConfirmationNumber: {payment?.ConfirmationNumber}, ProcessorStatus:{payment?.ProcessorStatus}, ApprovalStatus:{payment?.ApprovalStatus}, Message:{payment?.Message}");
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
                            GetAutoPaymentFailedEmail(), account.Key, totalBalance.ToString(), ex.Message.ToString());
                        Log.LogError(ex, "Retrieving invoices to pay...failed");
                    }
                    catch (Exception ex)
                    {
                        var failedinvoices = account.Value.Where(i => i.Balance > 0).ToArray();
                        var totalBalance = failedinvoices.Sum(i => i.Balance);

                        var configAutoPayFailedEmailId = configuration.GetValue<string>(Constants.Configuration.Options.FailedEmailId);

                        var emailsentResult = await accountManager.SendEmailAsync("Support Team", configAutoPayFailedEmailId, "ScentAir Account Center – Auto Payment Failed",
                            GetAutoPaymentFailedEmail(), account.Key, totalBalance.ToString(), ex.Message.ToString());
                        Log.LogError(ex, "Retrieving invoices to pay...failed");

                    }
                }

            }

            Log.LogDebug("Retrieving invoices to pay...complete");
            Environment.Exit(0);
        }



        public static string GetAutoPaymentFailedEmail()
        {
            return readFile("EmailTemplates/AutoPaymentFailedEmail.template");
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

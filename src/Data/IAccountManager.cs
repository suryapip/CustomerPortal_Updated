using MimeKit;
using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment
{
    public interface IAccountManager
    {

        Task<Account> CheckAccountAsync(string number, string pin, CancellationToken cancellationToken = default(CancellationToken));
        Task<Account> CheckAccountRegisteredAsync(string number, CancellationToken cancellationToken = default(CancellationToken));
        
        Task<IList<Invoice>> GetInvoicesAsync(string accountNumber, bool open = true, bool closed = false, bool full = false, CancellationToken cancellationToken = default(CancellationToken));
        Task<Invoice> GetInvoiceAsync(string accountNumber, string InvoiceNumber, CancellationToken cancellationToken = default(CancellationToken));

        Task<Account> GetAccountAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));    

        Task<Address> SaveAddressAsync(Address address, Address original = null, CancellationToken cancellationToken = default(CancellationToken));

        Task<Account> SaveAccountAsync(Account account, CancellationToken cancellationToken = default(CancellationToken));

        Task<ApplicationUser> GetUserAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));

        Task<Company> SaveCompanyAsync(Company company, CancellationToken cancellationToken = default(CancellationToken));

        Task<CompanyWireAchDetail> GetCompanyAchWireDetailsAsync(string InvoiceNumber, CancellationToken cancellationToken = default(CancellationToken));

        Task<CompanyWireAchDetail> SaveCompanyWireAchDetailsAsync(CompanyWireAchDetail ObjCompanyWireAch, Company objSellerCompany, CancellationToken cancellationToken = default(CancellationToken));

        Task<Invoice> SaveInvoiceAsync(Invoice invoice, CancellationToken cancellationToken = default(CancellationToken));

        Task<InvoiceHeaderExtension> GetInvoiceHeaderAdditionalAsync(string accountNumber, string InvoiceNumber, CancellationToken cancellationToken = default(CancellationToken));

        Task<InvoiceHeaderExtension> SaveInvoicHeaderAdditionalDetailsAsync(InvoiceHeaderExtension ObjInvoiceHeaderAdditional, CancellationToken cancellationToken = default(CancellationToken));


        Task<bool> InvoiceChangedAsync(Models.X3.Invoice invoice, CancellationToken cancellationToken = default(CancellationToken));

        Task<ITaskResult<PaymentResult>> SubmitPaymentAsync(string accountNumber, Guid paymentMethodId, string transactionNumber, decimal paymentAmount, ICollection<string> invoices,  CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<PaymentMethod>> GetPaymentMethodsAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<PaymentMethod> GetPaymentMethodAsync(string accountNumber, string name, CancellationToken cancellationToken = default(CancellationToken));
        Task<PaymentMethod> GetPaymentMethodAsync(string accountNumber, string paymentAccountNumber, string paymentRoutingNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<PaymentMethod> GetPaymentMethodAsync(string accountNumber, Guid id, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult<PaymentMethod>> SavePaymentMethod(PaymentMethod method, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> SetPaymentMethodToCurrent(string accountNumber, Guid id, bool currentAutoPayMethod = true, CancellationToken cancellationToken = default(CancellationToken));
        Task<PaymentMethod> UnenrollAutoPay(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));        
        Task<string> BeginPaymentTransactionAsync(string methodId, decimal paymentAmount, ICollection<string> invoices, DateTimeOffset? dateScheduled = null, string checkNumber = null, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> CompletePaymentTransactionAsync(string transactionNumber, string confirmationNumber, string processorStatus, string approvalStatus, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> CancelPaymentTransactionAsync(string transactionNumber, string chaseResponse, bool failed = true, CancellationToken cancellationToken = default(CancellationToken));
        Task<string> RetryPaymentAsync(string accountNumber, string priorTransactionNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<InvoicePayment>> GetScheduledPaymentsAsync(string accountNumber = null, DateTimeOffset? from = null, DateTimeOffset? until = null, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<Invoice>> GetUnScheduledInvoicesAsync(string accountNumber = null, bool full = false, CancellationToken cancellationToken = default(CancellationToken));

        Task<ITaskResult> SendEmailAsync(string recepientName, string recepientEmail, string subject, string body,string accountNumber, string amount, string exceptionDetails, bool isHtml = true);
        Task<ITaskResult> SendEmailAsync(string recipientName, string recipientEmail, string subject, string body, KeyValuePair<string, string>[] formFields, bool isHtml = true);
        Task<string[]> GetEligibleImportCustomerAsync(CancellationToken cancellationToken = default(CancellationToken));

        Task<string> GetAccountLanguage(string accountNumber);

        Task<ITaskResult> SendInvoiceNotification(string emailContent, string accountNumber, string dateDue, string balance, string balanceCurrency);

    }
}

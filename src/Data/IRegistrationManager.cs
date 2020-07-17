using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScentAir.Payment.Models;

namespace ScentAir.Payment
{
    public interface IRegistrationManager
    {
        Task<Account> CheckAccountAsync(string number, string pin, CancellationToken cancellationToken = default(CancellationToken));
        Task<Account> CheckAccountRegisteredAsync(string number, CancellationToken cancellationToken = default(CancellationToken));
        Task<Account> GetAccountAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult<ApplicationUser>> Register(ApplicationUser user, IEnumerable<string> roles, string accountNumber, string password, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult<ApplicationUser>> Register(ApplicationUser user, IEnumerable<string> roles, string accountNumber, string password, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendUsernameAsync(ApplicationUser user, CancellationToken cancellation = default(CancellationToken));
        Task<ITaskResult> SendUsernameAsync(ApplicationUser user, string emailTemplate, string AccountNumber, CancellationToken cancellation = default(CancellationToken));        
        Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendPaymentConfirmationEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendPaymentDeclineEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendPaymentMethodEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendUnenrollAutoPayEmailAsync(ApplicationUser user, string accountNumber, string paymentAccountNumber, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SendEnrollAutoPayEmailAsync(ApplicationUser user, string accountNumber, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));


        Task<bool>    IsEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, string EmailTemplate, string accountNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string code, string newPassword, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string code, string newPassword, string emailTemplate, string accountNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> ResetPasswordByAdminAsync(ApplicationUser user, string newPassword, CancellationToken cancellationToken = default(CancellationToken));
    }
}
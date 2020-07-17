using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment.Impl
{
    public class RegistrationManager : IRegistrationManager
    {
        private readonly PortalDbContext portalContext;
        private readonly X3DbContext x3Context;
        private readonly IAccountManager accountManager;
        private readonly ISecurityManager securityManager;


        public RegistrationManager(
            PortalDbContext portalContext,
            X3DbContext x3Context,
            IConfiguration configuration,
            IAccountManager accountManager,
            ISecurityManager securityManager,
            IHttpContextAccessor httpAccessor)
        {
            this.portalContext = portalContext;
            this.x3Context = x3Context;

            this.accountManager = accountManager;
            this.securityManager = securityManager;


            if (this.portalContext.Identity == null)
                this.portalContext.Identity = httpAccessor.HttpContext?.User?.Identity as ClaimsIdentity;
        }

        public async Task<ITaskResult<ApplicationUser>> Register(ApplicationUser user, IEnumerable<string> roles, string accountNumber, string password, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = await securityManager.CreateUserAsync(user, roles, accountNumber, password, cancellationToken);
            if (result.IsFailure)
                return result;

            var account = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == accountNumber);

            string emailMessage = emailTemplate
                 .Replace("{customerName}", account.Name)
                 .Replace("{accountNumber}", account.Number)
                 .Replace("{name}", user.FirstName);

            var emr = await SendConfirmationEmailAsync(user, account, emailMessage);

            return TaskResultBuilder.From(result).Add(emr).Success();
        }


        public async Task<ITaskResult<ApplicationUser>> Register(ApplicationUser user, IEnumerable<string> roles, string accountNumber, string password, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = await securityManager.CreateUserAsync(user, roles, accountNumber, password, cancellationToken);
            if (result.IsFailure)
                return result;

            var account = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == accountNumber);


            var emr = await SendConfirmationEmailAsync(user, account);

            return TaskResultBuilder.From(result).Add(emr).Success();
        }
        public async Task<ITaskResult> SendUsernameAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.SendUsernameEmailAsync(user, cancellationToken);
        }

        public async Task<ITaskResult> SendUsernameAsync(ApplicationUser user, string emailTemplate, string AccountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            Account acct = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == AccountNumber);

            string emailMessage = emailTemplate
                 .Replace("{customerName}", acct.Name)
                 .Replace("{accountNumber}", acct.Number)
                 .Replace("{name}", user.FirstName)
                 .Replace("{username}", user.UserName);

            return await securityManager.SendUsernameEmailAsync(user, emailMessage, cancellationToken);
        }

        public async Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {


            string emailMessage = emailTemplate
                 .Replace("{customerName}", account.Name)
                 .Replace("{accountNumber}", account.Number)
                 .Replace("{name}", user.FirstName)
                 .Replace("{username}", user.UserName);

            return await securityManager.SendConfirmationEmailAsync(user, account, emailTemplate, cancellationToken);
        }

        public async Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.SendConfirmationEmailAsync(user, account, cancellationToken);
        }
        public async Task<ITaskResult> SendPaymentConfirmationEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.SendPaymentConfirmationEmailAsync(user, emailMessage);
        }
        public async Task<ITaskResult> SendPaymentDeclineEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.SendPaymentDeclineEmailAsync(user, emailMessage);
        }
        public async Task<ITaskResult> SendPaymentMethodEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.SendPaymentMethodEmailAsync(user, emailMessage);
        }

        public async Task<ITaskResult> SendUnenrollAutoPayEmailAsync(ApplicationUser user, string accountNumber, string paymentAccountNumber, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            Account account = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == accountNumber);

            string emailMessage = emailTemplate
             .Replace("{customerName}", account.Name)
             .Replace("{accountNumber}", account.Number)
             .Replace("{name}", user.FirstName)
             .Replace("{paymentAccountNumber}", paymentAccountNumber.Right(paymentAccountNumber.Length - 4));

            return await securityManager.SendUnenrollAutoPayEmailAsync(user, emailMessage, cancellationToken);
        }

        public async Task<ITaskResult> SendEnrollAutoPayEmailAsync(ApplicationUser user, string accountNumber, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            Account account = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == accountNumber);

            string emailMessage = emailTemplate
             .Replace("{customerName}", account.Name)
             .Replace("{accountNumber}", account.Number)
             .Replace("{name}", user.FirstName);

            return await securityManager.SendEnrollAutoPayEmailAsync(user, emailMessage, cancellationToken);
        }


        public async Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {

          

            var tz = "";
            foreach (string w in user.AccountNumbers)
                tz = w;
            Account account = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == tz);

            string emailMessage = emailTemplate
             .Replace("{customerName}", account.Name)
             .Replace("{accountNumber}", account.Number)
             .Replace("{name}", user.FirstName);

            return await securityManager.SendPasswordResetEmailAsync(user, emailMessage, cancellationToken);
        }


    public async Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.SendPasswordResetEmailAsync(user, cancellationToken);
        }
        public async Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.ResetPasswordAsync(user, code, newPassword);
        }

        public async Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, string EmailTemplate, string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var tz = ""; 
            foreach (string w in user.AccountNumbers)
                tz = w;


            Account acct = await portalContext.Accounts.FirstOrDefaultAsync<Account>(x => x.Number == tz);

            string emailMessage = EmailTemplate
                 .Replace("{customerName}", acct.Name)
                 .Replace("{accountNumber}", acct.Number)
                 .Replace("{name}", user.FirstName)
                 .Replace("{url}", "https://portal.scentair.com");

            var t = await securityManager.ResetPasswordAsync(user, code, newPassword, emailMessage);

            return t;
        }

       public async Task<ITaskResult> ResetPasswordByAdminAsync(ApplicationUser user, string newPassword, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.ResetPasswordByAdminAsync(user, newPassword);
        }

        public async Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await securityManager.UpdatePasswordAsync(user, currentPassword, newPassword);
        }

        public async Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword, string emailTemplate, string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var acct = await GetAccountAsync(accountNumber);

            string emailMessage = emailTemplate
                 .Replace("{customerName}", acct.Name)
                 .Replace("{accountNumber}", acct.Number)
                 .Replace("{name}",user.FirstName)
                 .Replace("{url}", "https://portal.scentair.com");

            return await securityManager.UpdatePasswordAsync(user, currentPassword, newPassword, emailMessage);
        }

        public async Task<bool> IsEmailConfirmedAsync(ApplicationUser appUser, CancellationToken cancellationToken = default(CancellationToken))
        {
            var user = await portalContext.Users.FirstOrDefaultAsync(u => u.Id == appUser.Id, cancellationToken);

            return user?.EmailConfirmed ?? false;
        }


        public async Task<Account> CheckAccountAsync(string accountNumber, string pin, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await accountManager.CheckAccountAsync(accountNumber, pin, cancellationToken);
        }

        public async Task<Account> CheckAccountRegisteredAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await accountManager.CheckAccountRegisteredAsync(accountNumber, cancellationToken);
        }

        public async Task<Account> GetAccountAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await accountManager.GetAccountAsync(accountNumber, cancellationToken);
        }
    }
}

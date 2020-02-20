using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment.Impl
{
    public class SecurityManager : ISecurityManager
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<ApplicationRole> roleManager;
		private readonly ILogger<SecurityManager> logger;
		private readonly IEmailSender emailer;
        private readonly Uri externalPath;

        public SecurityManager(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IConfiguration configuration,
			ILoggerFactory loggerFactory,
            IEmailSender emailer,
            IHttpContextAccessor httpAccessor)
        {


            this.userManager = userManager;
            this.roleManager = roleManager;
			this.logger = loggerFactory.CreateLogger<SecurityManager>();

			this.emailer = emailer;


            var configPath = configuration.GetValue<string>(Constants.Configuration.ExternalPath);

			if (configPath.IsNullOrWhiteSpace())
				configPath = string.Empty;

			if (configPath.StartsWith("/"))
				configPath = configPath.Right(configPath.Length - 1);
			

			if (Uri.TryCreate($"{configPath}", UriKind.Absolute, out this.externalPath))
				return;

			var path = configuration.GetValue<string>("ASPNETCORE_URLS");
			if (!path.EndsWith("/"))
				path = $"{path}/";

			Uri.TryCreate($"{path}{configPath}", UriKind.Absolute, out this.externalPath);
		}

		private string encode(string decoded)
		{
			return Base32.EncodeAsBase32String(decoded, false);
		}
		private string decode(string encoded)
		{
			return Base32.DecodeFromBase32String(encoded);
		}

		private string createConfirmationUrl(string id, string code) => $"{externalPath}/register/{Uri.EscapeDataString(id)}/{Uri.EscapeDataString(encode(code))}";
        private string createPasswordResetUrl(string id, string code) => $"{externalPath}/forgot/password/{Uri.EscapeDataString(id)}/{Uri.EscapeDataString(encode(code))}";


        public async Task<ApplicationUser> GetUserByIdAsync(string userId, CancellationToken cancellationToken = default(CancellationToken))
        {
            //return await _userManager.FindByIdAsync(userId);
            return await userManager.Users
                .Include(u => u.Claims)
                .Where(u => u.Id.Equals(userId, StringComparison.OrdinalIgnoreCase))
                .FirstOrDefaultAsync(cancellationToken)
				.CatchDbAsync(logger);
        }
        public async Task<ApplicationUser> GetUserByUserNameAsync(string userName, CancellationToken cancellationToken = default(CancellationToken))
        {
            //return await _userManager.FindByNameAsync(userName);
            return await userManager.Users
                .Include(u => u.Claims)
                .Where(u => u.UserName.Equals(userName, StringComparison.OrdinalIgnoreCase))
                .FirstOrDefaultAsync(cancellationToken)
				.CatchDbAsync(logger);
        }
        public async Task<ApplicationUser> GetUserByAccountNumberAndEmailAsync(string accountNumber, string email, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await userManager
                .Users
                .Where(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase)
                         && u.Claims.Any(c => c.ClaimType == Constants.ClaimTypes.Account && c.ClaimValue == accountNumber))
                .FirstOrDefaultAsync(cancellationToken)
				.CatchDbAsync(logger);
        }
        public async Task<IList<ApplicationUser>> GetUsersByEmailAsync(string email, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await userManager
                .Users
                .Where(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
                .ToArrayAsync(cancellationToken)
				.CatchDbAsync(logger);
        }
        public async Task<IList<string>> GetUserRolesAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken)) => await userManager.GetRolesAsync(user);
        public async Task<(ApplicationUser, string[])> GetUserAndRolesAsync(string userId, CancellationToken cancellationToken = default(CancellationToken))
        {
            var user = await userManager.Users
                .Include(u => u.Roles)
                .Include(u => u.Claims)
                .Where(u => u.Id == userId)
                .FirstOrDefaultAsync(cancellationToken)
				.CatchDbAsync(logger);

            if (user == null)
                return (null, new string[] { });

            var userRoleIds = user.Roles.Select(r => r.RoleId).ToList();

            var roles = await roleManager.Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .Select(r => r.Name)
                .ToArrayAsync(cancellationToken)
				.CatchDbAsync(logger);

            return (user, roles);
        }
        public async Task<IList<(ApplicationUser, string[])>> GetUsersAndRolesAsync(int page, int pageSize, CancellationToken cancellationToken = default(CancellationToken))
        {
            IQueryable<ApplicationUser> usersQuery = userManager.Users
                .Include(u => u.Roles)
				.Include(u => u.Claims)
                .OrderBy(u => u.UserName);

            if (page != -1)
                usersQuery = usersQuery.Skip((page - 1) * pageSize);

            if (pageSize != -1)
                usersQuery = usersQuery.Take(pageSize);

            var users = await usersQuery.ToListAsync(cancellationToken)
				.CatchDbAsync(logger);

			if (users == null)
				return new (ApplicationUser, string[])[0];


            var userRoleIds = users.SelectMany(u => u.Roles.Select(r => r.RoleId)).ToList();

            var roles = await roleManager
                .Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .ToArrayAsync(cancellationToken)
				.CatchDbAsync();

            return users
                .Select(u => (u, u
                    .Roles
                    .Select(ur => roles.FirstOrDefault(r => r.Id == ur.RoleId)?.Name)
                    .Where(rn => !string.IsNullOrWhiteSpace(rn))
                    .ToArray()
                    ))
                .ToList();
        }


        public async Task<ITaskResult<ApplicationUser>> CreateUserAsync(ApplicationUser user, IEnumerable<string> roles, string accountNumber, string password, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder<ApplicationUser>();


            var idr = await userManager.CreateAsync(user, password);
            if (!idr.Succeeded)
                return result.Add("user", idr.Errors.Select(e => e.Description)).Fail();


            user = await userManager.FindByNameAsync(user.UserName);
            if (user == null)
                return result.Add("user", "could not find user after creation!!!").Fail();


            idr = await this.userManager.AddClaimAsync(user, new Claim(Constants.ClaimTypes.Account, accountNumber));
            if (!idr.Succeeded)
            {
                try { await DeleteUserAsync(user, cancellationToken); } catch { }

                return result.Add("user.claims", idr.Errors.Select(e => e.Description)).Fail();
            }


            idr = await this.userManager.AddToRolesAsync(user, roles.Distinct());
            if (!idr.Succeeded)
            {
                try { await DeleteUserAsync(user, cancellationToken); } catch { }

                return result.Add("user.roles", idr.Errors.Select(e => e.Description)).Fail();
            }


            return result.Success(user);
        }
        public async Task<ITaskResult<ApplicationUser>> UpdateUserAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken)) => await UpdateUserAsync(user, null, cancellationToken);
        public async Task<ITaskResult<ApplicationUser>> UpdateUserAsync(ApplicationUser user, IEnumerable<string> roles = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder<ApplicationUser>();


            var idr = await userManager.UpdateAsync(user);
            if (!idr.Succeeded)
                return result.Add("user", idr.Errors.Select(e => e.Description)).Fail();


            if (roles == null)
                return result.Success();



            var userRoles = await userManager.GetRolesAsync(user) ?? new string[] { };

            var rolesToRemove = userRoles.Except(roles).ToArray();
            var rolesToAdd = roles.Except(userRoles).Distinct().ToArray();

            if (rolesToRemove.Any())
            {
                idr = await userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!idr.Succeeded)
                    result.Add("user.roles", idr.Errors.Select(e => e.Description)).Fail();
            }

            if (rolesToAdd.Any())
            {
                idr = await userManager.AddToRolesAsync(user, rolesToAdd);
                if (!idr.Succeeded)
                    result.Add("user.roles", idr.Errors.Select(e => e.Description)).Fail();
            }

            user = await userManager.FindByNameAsync(user.UserName);
            if (user == null)
                return result.Add("user", "could not find user after update!!!").Fail();


            return result.Success(user);
        }
        public async Task<ITaskResult> ResetPasswordByAdminAsync(ApplicationUser user, string newPassword, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();


            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);

            var idr = await userManager.ResetPasswordAsync(user, resetToken, newPassword);

            if (!idr.Succeeded)
                return result.Add("user.password", idr.Errors.Select(e => e.Description)).Fail();


            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "Password Reset", "Your password was reset by an admin.");

            return result.Add(emr).Success();
        }

        public async Task<bool> ConfirmEmailAsync(string userId, string code, CancellationToken cancellationToken = default(CancellationToken))
        {
            var user = await GetUserByIdAsync(userId, cancellationToken);
            if (user == null)
                return false;

            if (user.EmailConfirmed)
                return true;

            var realCode = decode(Uri.UnescapeDataString(code));

            var result = await userManager.ConfirmEmailAsync(user, realCode);
            if (!result.Succeeded)
            {
                //await SendConfirmationEmailAsync(user, cancellationToken);
                return false;
            }

            user.EmailConfirmed = true;
            result = await userManager.UpdateAsync(user);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "Your email address is confirmed", $"Thank you for confirming your email address").SafeAsync();

            return result.Succeeded;
        }
        public async Task<ITaskResult> SendUsernameEmailAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "Your username", $"Your ScentAir username is \"{user.UserName}\"").SafeAsync();
        }

        public async Task<ITaskResult> SendUsernameEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailMessage = emailTemplate
             .Replace("{url}", url)
             .Replace("{urlContactUs}", contactUrl);

            var subjectLine = string.Empty;

            switch (string.IsNullOrEmpty(user.Language) ? null : user.Language.ToUpper())
            {
                case "FRA":
                    subjectLine = "Compte Portail ScentAir : identifiant oublié";
                    break;
                case "SPA":
                    subjectLine = "Portal de Cliente ScentAir -Olvidé mi Nombre de Usuario";
                    break;
                case "DUT":
                    subjectLine = "ScentAir Account Centrum - Gebruikersnaam vergeten";
                    break;
                default:
                    subjectLine = "ScentAir Account Center – Forgot Username";
                    break;
            }


            return await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, subjectLine, emailMessage).SafeAsync();
        }


        public async Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var code = await this.GenerateEmailConfirmationTokenAsync(user, cancellationToken);
            var url = this.createConfirmationUrl(user.Id, code);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center – Registration Confirmation", account.Number + "<br /" + account.Name + $"<br /> Dear " + user.Name + "<br /><br />Your registration is now complete. Login to view account details, make payments and add additional users.").SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailMessage = emailTemplate
                 .Replace("{url}", url)
                 .Replace("{urlContactUs}", contactUrl);
            var subjectLine = string.Empty;

            switch (string.IsNullOrEmpty(account.Language) ? null : account.Language.ToUpper())
            {
                case "FRA":
                    subjectLine = "Compte Portail ScentAir : confirmation d'enregistrement";
                    break;
                case "SPA":
                    subjectLine = "Portal de Cliente ScentAir - Confirmación de registro";
                    break;
                case "DUT":
                    subjectLine = "ScentAir Account Centrum - Registratie bevestiging";
                    break;
                default:
                    subjectLine = "ScentAir Account Center – Registration Confirmation";
                    break;
            }

            return await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, subjectLine, emailMessage).SafeAsync();
         
        }

        public async Task<ITaskResult> SendPaymentConfirmationEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailTemplate = emailMessage
                .Replace("{url}", url)
                .Replace("{urlContactUs}", contactUrl);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center – Payment Processing", emailTemplate).SafeAsync();

            return result.Add(emr).Success();
        }
        public async Task<ITaskResult> SendPaymentDeclineEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailTemplate = emailMessage
                .Replace("{url}", url)
                .Replace("{urlContactUs}", contactUrl);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center – Payment Declined", emailTemplate).SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> SendPaymentMethodEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailTemplate = emailMessage
                .Replace("{url}", url)
                .Replace("{urlContactUs}", contactUrl);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center – Payment Details Changed", emailTemplate).SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> ChangePasswordEmailAsync(ApplicationUser user, string ChangePasswordEmailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailMessage = ChangePasswordEmailTemplate
                 .Replace("{url}", url)
                 .Replace("{contactUsUrl", contactUrl);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center –Password Changed", emailMessage).SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var code = await this.GeneratePasswordResetTokenAsync(user, cancellationToken);
            var url = this.createPasswordResetUrl(user.Id, code);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "Reset Password", $"Please reset your password by clicking here: <a href=\"{url}\">Reset Password</a>").SafeAsync();

            return result.Add(emr).Success();
        }


        public async Task<ITaskResult> SendUnenrollAutoPayEmailAsync(ApplicationUser user, string ChangePasswordEmailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailMessage = ChangePasswordEmailTemplate
                 .Replace("{url}", url)
                 .Replace("{urlContactUs}", contactUrl);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center – AutoPay Unenrollment Request", emailMessage).SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> SendEnrollAutoPayEmailAsync(ApplicationUser user, string ChangePasswordEmailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            string emailMessage = ChangePasswordEmailTemplate
                 .Replace("{url}", url)
                 .Replace("{urlContactUs}", contactUrl);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center – AutoPay Enrollment", emailMessage).SafeAsync();

            return result.Add(emr).Success();
        }


        public async Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var code = await this.GeneratePasswordResetTokenAsync(user, cancellationToken);
            var url = this.createPasswordResetUrl(user.Id, code);

            var contactUrl = $"{externalPath}" + "/contactus";

            string emailMessage = emailTemplate
             .Replace("{url}", url)
             .Replace("{urlContactUs}", contactUrl);

            var subjectLine = string.Empty;

            switch (string.IsNullOrEmpty(user.Language) ? null : user.Language.ToUpper())
            {
                case "FRA":
                    subjectLine = "Compte Portail ScentAir : mot de passe oublié";
                    break;
                case "SPA":
                    subjectLine = "Portal de Cliente ScentAir -Olvidé mi Contraseña";
                    break;
                case "DUT":
                    subjectLine = "ScentAir Account Centrum - Wachtwoord vergeten";
                    break;
                default:
                    subjectLine = "ScentAir Account Center - Forgot Password";
                    break;
            }

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, subjectLine, emailMessage).SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, CancellationToken cancellationToken = default(CancellationToken))
        {

            var result = new TaskResultBuilder();


            var realCode = decode(Uri.UnescapeDataString(code));
            var idr = await userManager.ResetPasswordAsync(user, realCode, newPassword);
            if (!idr.Succeeded)
                return result.Add("user.password", idr.Errors.Select(e => e.Description)).Fail();


            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "Password Reset", "Your password was reset.").SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, string EmailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {

            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            var realCode = decode(Uri.UnescapeDataString(code));
            var idr = await userManager.ResetPasswordAsync(user, realCode, newPassword);
            if (!idr.Succeeded)
                return result.Add("user.password", idr.Errors.Select(e => e.Description)).Fail();

            string emailMessage = EmailTemplate
                 .Replace("{url}", url)
                 .Replace("{urlContactUs}", contactUrl);

            var subjectLine = string.Empty;

            switch (string.IsNullOrEmpty(user.Language) ? null : user.Language.ToUpper())
            {
                case "FRA":
                    subjectLine = "Compte Portail ScentAir : Changement de mot de passe";
                    break;
                case "SPA":
                    subjectLine = "Portal de Cliente ScentAir - Cambio de Contraseña";
                    break;
                case "DUT":
                    subjectLine = "ScentAir Account Centrum - Wachtwoord gewijzigd";
                    break;
                default:
                    subjectLine = "ScentAir Account Center – Password Changed";
                    break;
            }

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, subjectLine, emailMessage).SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword, CancellationToken cancellationToken = default(CancellationToken))
        {

            var result = new TaskResultBuilder();


            var idr = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!idr.Succeeded)
                return result.Add("user.password", idr.Errors.Select(e => e.Description)).Fail();


            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "Password Changed", "Your password was changed.").SafeAsync();

            return result.Add(emr).Success();
        }

        public async Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken))
        {

            var result = new TaskResultBuilder();

            var url = $"{externalPath}";
            var contactUrl = url + "/contactus";

            var idr = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!idr.Succeeded)
                return result.Add("user.password", idr.Errors.Select(e => e.Description)).Fail();

            string emailMessage = emailTemplate
             .Replace("{url}", url)
             .Replace("{urlContactUs}", contactUrl);

            var emr = await emailer.SendEmailAsync(user.NormalizedEmail, user.Email, "ScentAir Account Center - Password Changed", emailMessage).SafeAsync();

            return result.Add(emr).Success();
        }


        public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (!await userManager.CheckPasswordAsync(user, password))
            {
                if (!userManager.SupportsUserLockout)
                    await userManager.AccessFailedAsync(user);

                return false;
            }

            return true;
        }
        public async Task<bool> TestCanDeleteUserAsync(string userId, CancellationToken cancellationToken = default(CancellationToken)) =>
            //if (await _context.Orders.Where(o => o.CashierId == userId).AnyAsync())
            //    return false;

            //canDelete = !await ; //Do other tests...

            await Task.FromResult(true);
        public async Task<ITaskResult> DeleteUserAsync(string userId, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();


            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                return result.Add("user", "user not found").Fail();

            return await DeleteUserAsync(user);
        }
        public async Task<ITaskResult> DeleteUserAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();

            var idr = await userManager.DeleteAsync(user);
            if (!idr.Succeeded)
                return result.Add("user", idr.Errors.Select(e => e.Description)).Fail();

            return result.Success();
        }
        

        public async Task<ITaskResult<ApplicationRole>> CreateRoleAsync(ApplicationRole role, IEnumerable<string> claims = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder<ApplicationRole>();


            claims = claims ?? new string[] { };


            var invalidClaims = claims.Where(c => ApplicationPermissions.GetPermissionByValue(c) == null).ToArray();
            if (invalidClaims.Any())
                result.Add("claims", invalidClaims.Select(c => $"access denied for claim {c}")).Fail();

            var validClaims = claims.Except(invalidClaims).Distinct();


            var idr = await roleManager.CreateAsync(role);
            if (!idr.Succeeded)
                return result.Add("role", idr.Errors.Select(e => e.Description)).Fail();


            role = await roleManager.FindByNameAsync(role.Name);
            if (role == null)
                return result.Add("role", "cannot find role that was just created!!!").Fail();


            foreach (var claim in validClaims)
            {
                idr = await this.roleManager.AddClaimAsync(role, new Claim(Constants.ClaimTypes.Permission, ApplicationPermissions.GetPermissionByValue(claim)));
                if (!idr.Succeeded)
                {
                    result.Add("role.claims", $"cannot add claim {claim} to role").Fail();

                    break;
                }
            }

            if (!idr.Succeeded)
            {
                var dr = await DeleteRoleAsync(role, cancellationToken);
                if (dr.IsSuccessful)
                    return result.Add("role", "role is deleted").Fail();
            }

            role = await roleManager.FindByNameAsync(role.Name);


            return result.Success(role);
        }
        public async Task<ITaskResult<ApplicationRole>> UpdateRoleAsync(ApplicationRole role, IEnumerable<string> claims = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder<ApplicationRole>();


            claims = claims ?? new string[] { };


            var invalidClaims = claims.Where(c => ApplicationPermissions.GetPermissionByValue(c) == null).ToArray();
            if (invalidClaims.Any())
                result.Add("claims", invalidClaims.Select(c => $"access denied for claim {c}")).Fail();

            var validClaims = claims.Except(invalidClaims).Distinct();


            var idr = await roleManager.UpdateAsync(role);
            if (!idr.Succeeded)
                return result.Add("role", idr.Errors.Select(e => e.Description)).Fail();


            var roleClaims = (await roleManager.GetClaimsAsync(role)).Where(c => c.Type == Constants.ClaimTypes.Permission);
            var roleClaimValues = roleClaims.Select(c => c.Value).ToArray();

            var claimsToRemove = roleClaimValues.Except(claims).ToArray();
            var claimsToAdd = claims.Except(roleClaimValues).Distinct().ToArray();

            foreach (var claim in claimsToRemove)
            {
                idr = await roleManager.RemoveClaimAsync(role, roleClaims.Where(c => c.Value == claim).FirstOrDefault());
                if (!idr.Succeeded)
                    result.Add("role.claims", $"could not remove claim {claim}")
                            .Add("role.claims", idr.Errors.Select(e => e.Description).ToArray())
                            .Fail();

            }

            foreach (var claim in claimsToAdd)
            {
                idr = await roleManager.AddClaimAsync(role, new Claim(Constants.ClaimTypes.Permission, ApplicationPermissions.GetPermissionByValue(claim)));
                if (!idr.Succeeded)
                    result.Add("role.claims", $"could not add claim {claim}")
                            .Add("role.claims", idr.Errors.Select(e => e.Description).ToArray())
                            .Fail();
            }

            role = await roleManager.FindByNameAsync(role.Name);
            if (role == null)
                return result.Add("role", "cannot find role that was just updated!!!").Fail();


            return result.Success(role);
        }
        public async Task<ITaskResult> DeleteRoleAsync(string roleName, CancellationToken cancellationToken = default(CancellationToken))
        {
            var role = await roleManager.FindByNameAsync(roleName);
            if (role == null)
                return new TaskResultBuilder().Add("role", "role not found").Fail();

            return await DeleteRoleAsync(role);
        }
        public async Task<ITaskResult> DeleteRoleAsync(ApplicationRole role, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder();


            var idr = await roleManager.DeleteAsync(role);
            if (!idr.Succeeded)
                return result.Add("role", idr.Errors.Select(e => e.Description)).Fail();

            return result.Success();
        }




        public async Task<ApplicationRole> GetRoleByIdAsync(string roleId, CancellationToken cancellationToken = default(CancellationToken)) => await roleManager.FindByIdAsync(roleId);
        public async Task<ApplicationRole> GetRoleByNameAsync(string roleName, CancellationToken cancellationToken = default(CancellationToken)) => await roleManager.FindByNameAsync(roleName);
        public async Task<ApplicationRole> GetRoleWithRelatedAsync(string roleName, CancellationToken cancellationToken = default(CancellationToken))
        {
            var role = await roleManager.Roles
                .Include(r => r.Claims)
                .Include(r => r.Users)
                .Where(r => r.Name == roleName)
                .FirstOrDefaultAsync(cancellationToken);

            return role;
        }
        public async Task<IList<ApplicationRole>> GetRolesWithRelatedAsync(int page, int pageSize, CancellationToken cancellationToken = default(CancellationToken))
        {
            IQueryable<ApplicationRole> rolesQuery = roleManager.Roles
                .Include(r => r.Claims)
                .Include(r => r.Users)
                .OrderBy(r => r.Name);

            if (page != -1)
                rolesQuery = rolesQuery.Skip((page - 1) * pageSize);

            if (pageSize != -1)
                rolesQuery = rolesQuery.Take(pageSize);

            var roles = await rolesQuery.ToListAsync(cancellationToken);

            return roles;
        }


        public async Task<bool> TestCanDeleteRoleAsync(string roleId, CancellationToken cancellationToken = default(CancellationToken)) => !await roleManager.Roles.AnyAsync(r => r.Id == roleId && r.Users.Any(), cancellationToken);
        public async Task<bool> IsEmailConfirmedAsync(ApplicationUser appUser, CancellationToken cancellationToken = default(CancellationToken))
        {
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == appUser.Id, cancellationToken);

            return user?.EmailConfirmed ?? false;
        }

        public async Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<string> GenerateEmailConfirmationTokenAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await userManager.GenerateEmailConfirmationTokenAsync(user);
        }
    }
}

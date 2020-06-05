using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScentAir.Payment.Models;

namespace ScentAir.Payment
{
    public interface ISFAccountSettingsManager
    {
        Task<SFAccountSettings> GetSFAccountSettingsAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));

        //Task<ITaskResult<ApplicationRole>> CreateRoleAsync(ApplicationRole role, IEnumerable<string> claims, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult<ApplicationUser>> CreateUserAsync(ApplicationUser user, IEnumerable<string> roles, string accountNumber, string password, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> DeleteRoleAsync(ApplicationRole role, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> DeleteRoleAsync(string roleName, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> DeleteUserAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> DeleteUserAsync(string userId, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendConfirmationEmailAsync(ApplicationUser user, Account account, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendPaymentConfirmationEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendPaymentDeclineEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendPaymentMethodEmailAsync(ApplicationUser user, string emailMessage, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> ChangePasswordEmailAsync(ApplicationUser user, string ChangePasswordEmailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendPasswordResetEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendUnenrollAutoPayEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendEnrollAutoPayEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> SendUsernameEmailAsync(ApplicationUser user, CancellationToken cancellationToken);
        //Task<ITaskResult> SendUsernameEmailAsync(ApplicationUser user, string emailTemplate, CancellationToken cancellationToken);
        //Task<bool> ConfirmEmailAsync(string userId, string code, CancellationToken cancellationToken = default(CancellationToken));


        //Task<ApplicationRole> GetRoleByIdAsync(string roleId, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ApplicationRole> GetRoleByNameAsync(string roleName, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ApplicationRole> GetRoleWithRelatedAsync(string roleName, CancellationToken cancellationToken = default(CancellationToken));
        //Task<IList<ApplicationRole>> GetRolesWithRelatedAsync(int page, int pageSize, CancellationToken cancellationToken = default(CancellationToken));
        //Task<(ApplicationUser user, string[] roles)> GetUserAndRolesAsync(string userId, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ApplicationUser> GetUserByAccountNumberAndEmailAsync(string accountNumber, string email, CancellationToken cancellationToken = default(CancellationToken));
        //Task<IList<ApplicationUser>> GetUsersByEmailAsync(string email, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ApplicationUser> GetUserByIdAsync(string userId, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ApplicationUser> GetUserByUserNameAsync(string userName, CancellationToken cancellationToken = default(CancellationToken));
        //Task<IList<string>> GetUserRolesAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        //Task<IList<(ApplicationUser user, string[] roles)>> GetUsersAndRolesAsync(int page, int pageSize, CancellationToken cancellationToken = default(CancellationToken));
        //Task<bool> IsEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword, string EmailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> ResetPasswordByAdminAsync(ApplicationUser user, string newPassword, CancellationToken cancellationToken = default(CancellationToken));
        //Task<bool> CheckPasswordAsync(ApplicationUser user, string password, CancellationToken cancellationToken = default(CancellationToken));
        //Task<bool> TestCanDeleteRoleAsync(string roleId, CancellationToken cancellationToken = default(CancellationToken));
        //Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        //Task<string> GenerateEmailConfirmationTokenAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        //Task<bool> TestCanDeleteUserAsync(string userId, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword, string emailTemplate, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult<ApplicationRole>> UpdateRoleAsync(ApplicationRole role, IEnumerable<string> claims, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult<ApplicationUser>> UpdateUserAsync(ApplicationUser user, CancellationToken cancellationToken = default(CancellationToken));
        //Task<ITaskResult<ApplicationUser>> UpdateUserAsync(ApplicationUser user, IEnumerable<string> roles, CancellationToken cancellationToken = default(CancellationToken));
    }
}
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenIddict.Validation;
using ScentAir.Payment.Authorization;
using ScentAir.Payment.Helpers;
using ScentAir.Payment.Models;
using ScentAir.Payment.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace ScentAir.Payment.Controllers
{
    [Authorize(AuthenticationSchemes = OpenIddictValidationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    //[ApiController]
    public class SFAccountController : CommonController
    {
        private readonly ISFAccountSettingsManager sfAccountSettingsManager;

        public SFAccountController(
            ILoggerFactory loggerFactory,
            ISFAccountSettingsManager sfAccountSettingsManager)
            : base(loggerFactory)
        {
            this.sfAccountSettingsManager = sfAccountSettingsManager;
        }

        #region Account Settings

        [HttpGet("sfaccountsettings")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(SFAccountSettingsViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetSFAccountSettings()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var (accountNumber, response) = IsAuthorized();     // Use IsAuthorized() to get the Account Number.

            var vm = await getSFAccountSettingsViewModelHelper(accountNumber).SafeAsync(Log);

            if (vm == null)
                return NotFound();

            return Ok(vm);
        }

        private async Task<SFAccountSettingsViewModel> getSFAccountSettingsViewModelHelper(string accountNumber)
        {
            SFAccountSettings sfAccountSettings = await sfAccountSettingsManager.GetSFAccountSettingsAsync(accountNumber).SafeAsync(Log);
            if (sfAccountSettings == null)
                return null;

            var vm = Mapper.Map<SFAccountSettingsViewModel>(sfAccountSettings);

            return vm;
        }

        //[HttpPost("roles")]
        //[Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        //[ProducesResponseType(201, Type = typeof(RoleViewModel))]
        //[ProducesResponseType(400)]
        //public async Task<IActionResult> PostRole([FromBody][Required] RoleViewModel role)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();
        //    var appRole = Mapper.Map<ApplicationRole>(role);
        //    var result = await securityManager.CreateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray()).SafeAsync(Log);
        //    if (!result.IsSuccessful)
        //        return BadRequest("Could not create role");
        //    var vm = await getRoleViewModelHelper(appRole.Name).SafeAsync(Log);
        //    return CreatedAtAction(nameof(GetRoleById), new { id = vm.Id }, vm);
        //}

        //[HttpPut("roles/{id}")]
        //[Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        //[ProducesResponseType(204)]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(404)]
        //public async Task<IActionResult> PutRole([Required] string id, [FromBody][Required] RoleViewModel role)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();
        //    if (!string.IsNullOrWhiteSpace(role.Id) && id != role.Id)
        //        return BadRequest("Conflicting role id in parameter and model data");
        //    var appRole = await securityManager.GetRoleByIdAsync(id).SafeAsync(Log);
        //    if (appRole == null)
        //        return NotFound();
        //    Mapper.Map<RoleViewModel, ApplicationRole>(role, appRole);
        //    var result = await securityManager.UpdateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray()).SafeAsync(Log);
        //    if (!result.IsSuccessful)
        //        return BadRequest("Could not update role");
        //    return NoContent();
        //}

        #endregion Account Settings


        //[HttpPut("roles/{id}")]
        //[Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        //[ProducesResponseType(204)]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(404)]
        //public async Task<IActionResult> PutRole([Required] string id, [FromBody][Required] RoleViewModel role)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();


        //    if (!string.IsNullOrWhiteSpace(role.Id) && id != role.Id)
        //        return BadRequest("Conflicting role id in parameter and model data");



        //    var appRole = await securityManager.GetRoleByIdAsync(id).SafeAsync(Log);
        //    if (appRole == null)
        //        return NotFound();


        //    Mapper.Map<RoleViewModel, ApplicationRole>(role, appRole);

        //    var result = await securityManager.UpdateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray()).SafeAsync(Log);
        //    if (!result.IsSuccessful)
        //        return BadRequest("Could not update role");

        //    return NoContent();
        //}


        //[HttpPost("roles")]
        //[Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        //[ProducesResponseType(201, Type = typeof(RoleViewModel))]
        //[ProducesResponseType(400)]
        //public async Task<IActionResult> PostRole([FromBody][Required] RoleViewModel role)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();



        //    var appRole = Mapper.Map<ApplicationRole>(role);
        //    var result = await securityManager.CreateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray()).SafeAsync(Log);
        //    if (!result.IsSuccessful)
        //        return BadRequest("Could not create role");


        //    var vm = await getRoleViewModelHelper(appRole.Name).SafeAsync(Log);
        //    return CreatedAtAction(nameof(GetRoleById), new { id = vm.Id }, vm);
        //}


        //#region Contacts

        //[HttpGet("users")]
        //[Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        //[ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<UserViewModel>))]
        //public async Task<IActionResult> GetUsers() => await GetUsers(-1, -1);


        //[HttpGet("users/{pageNumber:int}/{pageSize:int}")]
        //[Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        //[ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<UserViewModel>))]
        //[ProducesResponseType((int)HttpStatusCode.Forbidden)]
        //[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        //[ProducesResponseType((int)HttpStatusCode.NotFound)]
        //[ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //public async Task<IActionResult> GetUsers(int pageNumber, int pageSize)
        //{
        //    var usersAndRoles = await securityManager.GetUsersAndRolesAsync(pageNumber, pageSize).SafeAsync(Log);
        //    if (usersAndRoles == null)
        //        return NotFound();


        //    var result = new List<UserViewModel>();
        //    foreach (var (user, roles) in usersAndRoles)
        //    {
        //        var vm = Mapper.Map<UserViewModel>(user);
        //        vm.Roles = roles;

        //        result.Add(vm);
        //    }

        //    return Ok(result);
        //}

        //[HttpPost("users")]
        //[Authorize(Authorization.Policies.ManageAllUsersPolicy)]
        //[ProducesResponseType(201, Type = typeof(UserViewModel))]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(403)]
        //public async Task<IActionResult> Register([FromBody] UserEditViewModel user)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    if (user == null)
        //        return BadRequest($"{nameof(user)} cannot be null");


        //    if (!(await authorizationService.AuthorizeAsync(this.User, Tuple.Create(user.Roles, new string[] { }), Authorization.Policies.AssignAllowedRolesPolicy).SafeAsync(Log)).Succeeded)
        //        return new ChallengeResult();



        //    var appUser = Mapper.Map<ApplicationUser>(user);

        //    var result = await securityManager.CreateUserAsync(appUser, user.Roles, user.AccountNumber, user.NewPassword).SafeAsync(Log);
        //    //var (success, errorMsgs) = await accountManager.CreateUserAsync(appUser, user.Roles, user.NewPassword);
        //    if (!result.IsSuccessful)
        //        return BadRequest("Could not create user");


        //    var vm = await getUserViewModelHelper(appUser.Id).SafeAsync(Log);

        //    return CreatedAtAction(nameof(GetUserById), new { id = vm.Id }, vm);
        //}

        //#endregion Contacts


        //#region Specific Contact

        //[HttpGet("users/{id}", Name = nameof(GetUserById))]
        //[ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(UserViewModel))]
        //[ProducesResponseType((int)HttpStatusCode.BadRequest)]
        //[ProducesResponseType((int)HttpStatusCode.Forbidden)]
        //[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        //[ProducesResponseType((int)HttpStatusCode.NotFound)]
        //[ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        ////[ValidateAntiForgeryToken]
        //public async Task<IActionResult> GetUserById([FromQuery][Required] string id)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();


        //    var result = await authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Read).SafeAsync(Log);
        //    if (!result.Succeeded)
        //        return new ChallengeResult();



        //    var vm = await getUserViewModelHelper(id).SafeAsync(Log);

        //    if (vm == null)
        //        return NotFound();

        //    return Ok(vm);
        //}

        //[HttpPut("users/{id}")]
        //[ProducesResponseType(typeof(UserEditViewModel), (int)HttpStatusCode.OK)]
        //[ProducesResponseType((int)HttpStatusCode.BadRequest)]
        //[ProducesResponseType((int)HttpStatusCode.Forbidden)]
        //[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        //[ProducesResponseType((int)HttpStatusCode.NotFound)]
        //[ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //public async Task<IActionResult> PutUser([FromQuery][Required] string id, [FromBody][Required] UserEditViewModel editedUser)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    if (editedUser == null)
        //        return BadRequest($"{nameof(editedUser)} cannot be null");

        //    if (!string.IsNullOrWhiteSpace(editedUser.Id) && id != editedUser.Id)
        //        return BadRequest("Conflicting user id in parameter and model data");


        //    var user = await securityManager.GetUserByIdAsync(id).SafeAsync(Log);
        //    if (user == null)
        //        return NotFound(id);


        //    if (Utilities.GetUserId(this.User) == id)
        //    {
        //        var pwdCurrentIsEmpty = string.IsNullOrWhiteSpace(editedUser.CurrentPassword);
        //        var pwdNewIsEmpty = string.IsNullOrWhiteSpace(editedUser.NewPassword);
        //        var changeUsername = user.UserName != editedUser.UserName;

        //        if (pwdCurrentIsEmpty && !pwdNewIsEmpty)
        //            return BadRequest("Current password is required when changing your own password");

        //        if (pwdCurrentIsEmpty && changeUsername)
        //            return BadRequest("Current password is required when changing your own username");


        //        if (changeUsername || !pwdNewIsEmpty)
        //        {
        //            var valid = await securityManager.CheckPasswordAsync(user, editedUser.CurrentPassword).SafeAsync(false, Log);
        //            if (!valid)
        //                return BadRequest("The password is incorrect");
        //        }
        //    }

        //    var currentRoles = await securityManager.GetUserRolesAsync(user);

        //    var manageUsersPolicy = authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update).SafeAsync(Log);
        //    var assignRolePolicy = authorizationService.AuthorizeAsync(this.User, Tuple.Create(editedUser.Roles, currentRoles), Authorization.Policies.AssignAllowedRolesPolicy).SafeAsync(Log);


        //    var notallowed = (await Task.WhenAll(manageUsersPolicy, assignRolePolicy).SafeAsync(Log)).Any(r => !r.Succeeded);
        //    if (notallowed)
        //        return Unauthorized();



        //    Mapper.Map<UserViewModel, ApplicationUser>(editedUser, user);

        //    var result = await securityManager.UpdateUserAsync(user, editedUser.Roles).SafeAsync(Log);
        //    if (!result.IsSuccessful)
        //        return BadRequest("Could not update");


        //    if (string.IsNullOrWhiteSpace(editedUser.NewPassword))
        //        return Ok(Mapper.Map<UserEditViewModel>(result.Result));

        //    var passwordResult = (!string.IsNullOrWhiteSpace(editedUser.CurrentPassword))
        //                       ? await securityManager.UpdatePasswordAsync(user, editedUser.CurrentPassword, editedUser.NewPassword).SafeAsync(Log)
        //                       : await securityManager.ResetPasswordByAdminAsync(user, editedUser.NewPassword).SafeAsync(Log);

        //    if (!passwordResult.IsSuccessful)
        //        return BadRequest(passwordResult);

        //    return Ok(result.Result);
        //}

        //[HttpPatch("users/{id}")]
        //[ProducesResponseType((int)HttpStatusCode.NoContent)]
        //[ProducesResponseType((int)HttpStatusCode.BadRequest)]
        //[ProducesResponseType((int)HttpStatusCode.Forbidden)]
        //[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        //[ProducesResponseType((int)HttpStatusCode.NotFound)]
        //[ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //public async Task<IActionResult> PatchUser([FromQuery][Required] string id, [FromBody][Required] JsonPatchDocument<UserPatchViewModel> patch)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    if (patch == null)
        //        return BadRequest($"{nameof(patch)} cannot be null");

        //    if (!(await authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update).SafeAsync(Log)).Succeeded)
        //        return new ChallengeResult();


        //    var appUser = await securityManager.GetUserByIdAsync(id).SafeAsync(Log);
        //    if (appUser == null)
        //        return NotFound(id);


        //    var userPVM = Mapper.Map<UserPatchViewModel>(appUser);
        //    patch.ApplyTo(userPVM, ModelState);


        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    Mapper.Map<UserPatchViewModel, ApplicationUser>(userPVM, appUser);

        //    var result = await securityManager.UpdateUserAsync(appUser).SafeAsync(Log);
        //    if (result.IsSuccessful)
        //        return NoContent();


        //    return BadRequest(result.Errors);
        //}

        //[HttpDelete("users/{id}")]
        //[ProducesResponseType(200, Type = typeof(UserViewModel))]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(403)]
        //[ProducesResponseType(404)]
        //public async Task<IActionResult> DeleteUser([Required] string id)
        //{
        //    if (!(await authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Delete).SafeAsync(Log)).Succeeded)
        //        return new ChallengeResult();

        //    if (!await securityManager.TestCanDeleteUserAsync(id))
        //        return BadRequest("User cannot be deleted. Delete all orders associated with this user and try again");


        //    var appUser = await this.securityManager.GetUserByIdAsync(id).SafeAsync(Log);
        //    if (appUser == null)
        //        return NotFound();


        //    var vm = await getUserViewModelHelper(appUser.Id).SafeAsync(Log);
        //    if (vm == null)
        //        return NotFound();

        //    var result = await this.securityManager.DeleteUserAsync(appUser).SafeAsync(Log);
        //    if (!result.IsSuccessful)
        //        return BadRequest("Could not delete user");

        //    return Ok(vm);
        //}

        //#endregion Specific Contact


        //#region Roles

        //[HttpGet("roles")]
        //[Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        //[ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        //public async Task<IActionResult> GetRoles() => await GetRoles(-1, -1).SafeAsync(Log);


        //[HttpGet("roles/{pageNumber:int}/{pageSize:int}")]
        //[Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        //[ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        //public async Task<IActionResult> GetRoles(int pageNumber, int pageSize)
        //{
        //    var roles = await securityManager.GetRolesWithRelatedAsync(pageNumber, pageSize).SafeAsync(Log);

        //    return Ok(Mapper.Map<List<RoleViewModel>>(roles));
        //}

        //#endregion Roles


        //private async Task<UserViewModel> getUserViewModelHelper(string userId)
        //{
        //    (ApplicationUser user, string[] roles) = await securityManager.GetUserAndRolesAsync(userId).SafeAsync((null, null), Log);
        //    if (user == null)
        //        return null;

        //    var vm = Mapper.Map<UserViewModel>(user);
        //    vm.Roles = roles;

        //    return vm;
        //}

        //private async Task<RoleViewModel> getRoleViewModelHelper(string roleName)
        //{
        //    var role = await securityManager.GetRoleWithRelatedAsync(roleName).SafeAsync(Log);
        //    if (role != null)
        //        return Mapper.Map<RoleViewModel>(role);


        //    return null;
        //}

    }
}

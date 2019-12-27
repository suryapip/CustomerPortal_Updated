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
    public class AccountController : CommonController
    {
        private readonly ILookupManager lookupManager;
        private readonly IConfiguration configuration;
        private readonly IRegistrationManager registrationManager;
        private readonly ISecurityManager securityManager;
        private readonly IAuthorizationService authorizationService;
        private readonly IImportManager importer;
        private readonly bool skipEmailConfirmation;
		private readonly bool importEnabled;
        private readonly bool emailenabled;

        public AccountController(
            ILoggerFactory loggerFactory,
            ILookupManager lookupManager,
            IConfiguration configuration,
            IRegistrationManager registrationManager,
            ISecurityManager securityManager,
            IAuthorizationService authorizationService,
            IImportManager importService)
            : base(loggerFactory)
        {
            this.lookupManager = lookupManager;
            this.configuration = configuration;
            this.registrationManager = registrationManager;
            this.securityManager = securityManager;
            this.authorizationService = authorizationService;
            this.importer = importService;

            this.skipEmailConfirmation = configuration.GetValue<bool>(Constants.Configuration.Options.SkipEmailConfirmation, false);
			this.importEnabled = configuration.GetValue<bool>(Constants.Configuration.Options.ImportEnabled, false);
        }


        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(RegisterViewModel))]
        [ProducesResponseType((int)HttpStatusCode.Accepted, Type = typeof(RegisterViewModel))]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Register([FromBody][Required] RegisterViewModel data, [FromQuery] string returnUrl = null)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            if (data.Account == null)
                return BadRequest("Missing account information");

            var claim = await registrationManager.CheckAccountRegisteredAsync(data.Account.Number);


            if (claim == null)
                return BadRequest(String.Concat("This account has been already registered. If needed, you may reset your username or password "));


            var account = await registrationManager
                .CheckAccountAsync(data.Account.Number, data.Account.Pin)
                .SafeAsync(Log);

			if (account == null)
                return BadRequest("Invalid Account or Pin number");


            if (this.importEnabled)
				this.importer.Import(account.Number);


            if (data.User == null || string.IsNullOrWhiteSpace(data.User.Email))
            {
                data.Account = Mapper.Map<AccountViewModel>(account);
                return Accepted(data);
            }


            var user = Mapper.Map<ApplicationUser>(data.User);


            // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
            user.EmailConfirmed = skipEmailConfirmation || await registrationManager.IsEmailConfirmedAsync(user);


            user.IsEnabled = true;

            
            var result = await registrationManager.Register(user, new[] { Constants.Roles.AccountUser }, account.Number, data.User.NewPassword,EmailTemplates.GetRegistrationConfirmationEmail(account.Language)).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest(result.Errors);


            // TODO Validate
            user = await securityManager.GetUserByIdAsync(user.Id).SafeAsync(Log);
			if (user == null)
				return StatusCode((int) HttpStatusCode.InternalServerError, "Could not verify registration.  Please try again later");
				//throw new PortalException(PortalExceptionType.Entity_Missing);

            data.User = Mapper.Map<RegisterUserViewModel>(user);
            data.Account = Mapper.Map<AccountViewModel>(account);


            return CreatedAtAction(nameof(Register), null, data);
        }


        [HttpPost("register/confirm")]
        [AllowAnonymous]
		[Consumes(MimeTypes.TextPlain, MimeTypes.MultipartFormData, "application/x-www-form-urlencoded")]
		[ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(bool))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> RegisterConfirm()
        {
			var data = null as ConfirmationViewModel;

			if (Request.HasFormContentType)
				data = new ConfirmationViewModel
				{
					Code = Request.Form["code"],
					UserId = Request.Form["userId"],
				};
			else
			{
				var body = null as string;
				using (var reader = new StreamReader(Request.Body))
					body = await reader.ReadToEndAsync();

				var qs = HttpUtility.ParseQueryString($"?{body}");

				data = new ConfirmationViewModel
				{
					Code = qs["code"],
					UserId = qs["userId"],
				};
			}


            if (!ModelState.IsValid)
                return BadRequest();


            if (data.UserId.IsNullOrWhiteSpace())
                return BadRequest("Invalid User Id");

            if (data.Code.IsNullOrWhiteSpace())
                return BadRequest("Invalid Registration Code");



            var check = await securityManager
                .ConfirmEmailAsync(data.UserId, data.Code)
                .SafeAsync(false, Log);

            return Ok(check);
        }



        [HttpPost("forgot/username")]
        [AllowAnonymous]
        [ProducesResponseType((int)HttpStatusCode.OK, Type= typeof(string))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotUserName([FromBody][Required] ForgotUsernameViewModel data)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var user = await securityManager.GetUserByAccountNumberAndEmailAsync(data.AccountNumber, data.EmailAddress).SafeAsync(Log);
            if (user == null) // Don't reveal that the user does not exist or is not confirmed
                return Ok();


            var confirmed = skipEmailConfirmation || await registrationManager.IsEmailConfirmedAsync(user).SafeAsync(false, Log);
            if (!confirmed)
            {
                //var result = await registrationManager.SendConfirmationEmailAsync(user).SafeAsync(Log);
                //if (result.IsSuccessful)
                //    return BadRequest("A new email confirmation has been sent");

                return this.StatusCode((int)HttpStatusCode.InternalServerError, "Could not send confirmation email");
            }
            else
            {
                // Fetch User's native language
                var userAccunt = await registrationManager.GetAccountAsync(data.AccountNumber).SafeAsync(Log);
                user.Language = userAccunt?.Language;

                var result = await registrationManager.SendUsernameAsync(user,EmailTemplates.ForgotUsernameEmail(userAccunt?.Language), data.AccountNumber).SafeAsync(Log);
                if (result.IsSuccessful)
                    return Ok();

                return this.StatusCode((int)HttpStatusCode.InternalServerError, "Could not send user name via email");
            }
        }



        [HttpPost("forgot/password")]
        [AllowAnonymous]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(string))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword([FromBody][Required] string username)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var user = await securityManager.GetUserByUserNameAsync(username).SafeAsync(Log);
            if (user == null) // Don't reveal that the user does not exist or is not confirmed
                return Ok();


            var confirmed = skipEmailConfirmation || await registrationManager.IsEmailConfirmedAsync(user).SafeAsync(false, Log);
            if (!confirmed)
            {
                //var result = await registrationManager.SendConfirmationEmailAsync(user).SafeAsync(Log);
                //if (result.IsSuccessful)
                //    return BadRequest("Your account has not been confirmed.  A new email confirmation has been sent.");

                return this.StatusCode((int)HttpStatusCode.InternalServerError, "Could not send confirmation email");
            }
            else
            {
                // Fetch User's native language
                var userAccunt = await registrationManager.GetAccountAsync(user.AccountNumbers.SingleOrDefault()).SafeAsync(Log);
                user.Language = userAccunt?.Language;
                string emailTemplate = EmailTemplates.ForgotPasswordEmail(user.Language);
                var result = await registrationManager.SendPasswordResetEmailAsync(user, emailTemplate).SafeAsync(Log);
                if (result.IsSuccessful)
                    return Ok();

                return this.StatusCode((int)HttpStatusCode.InternalServerError, "Could not send reset password code via email");
            }
        }


		[HttpPost("reset/password")]
		[AllowAnonymous]
		[Consumes(MimeTypes.TextPlain, MimeTypes.MultipartFormData, "application/x-www-form-urlencoded")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		[ProducesResponseType((int)HttpStatusCode.Forbidden)]
		[ProducesResponseType((int)HttpStatusCode.NotFound)]
		[ProducesResponseType((int)HttpStatusCode.InternalServerError)]
		//[ValidateAntiForgeryToken]
		public async Task<IActionResult> ResetPassword()
		{
			var data = null as ResetPasswordViewModel;

			if (Request.HasFormContentType)
				data = new ResetPasswordViewModel
				{
					Username = Request.Form["username"],
					Password = Request.Form["password"],
					Code = Request.Form["code"],
				};
			else
			{
				var body = null as string;
				using (var reader = new StreamReader(Request.Body))
					body = await reader.ReadToEndAsync();

				var qs = HttpUtility.ParseQueryString($"?{body}");

				data = new ResetPasswordViewModel
				{
					Username = qs["username"],
					Password = qs["password"],
					Code = qs["code"],
				};
			}

			if (!ModelState.IsValid)
                return BadRequest();


            if (data.Username.IsNullOrWhiteSpace())
                return BadRequest("Invalid Username");


            var user = await securityManager.GetUserByUserNameAsync(data.Username).SafeAsync(Log);
            if (user == null)
                return Ok();

            var (accountNumber, response) = IsAuthorized();


            // Fetch User's native language
            var userAccunt = await registrationManager.GetAccountAsync(user.AccountNumbers.SingleOrDefault()).SafeAsync(Log);
            user.Language = userAccunt?.Language;

            var result = await registrationManager.ResetPasswordAsync(user, data.Code, data.Password, EmailTemplates.ChangePasswordEmail(user.Language), accountNumber).SafeAsync(Log);
            if (result.IsSuccessful)
            {
                return Ok();
            }


            return BadRequest("Invalid Reset Code");
        }

        [HttpPost("reset/updatepassword")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdatePassword()
        {
            var data = null as ResetPasswordViewModel;


            if (Request.HasFormContentType)
                data = new ResetPasswordViewModel
                {
                    Username = Request.Form["username"],
                    Password = Request.Form["password"],
                    Code = Request.Form["currentPassword"],
                };
            else
            {
                var body = null as string;
                using (var reader = new StreamReader(Request.Body))
                    body = await reader.ReadToEndAsync();

                var qs = HttpUtility.ParseQueryString($"?{body}");

                data = new ResetPasswordViewModel
                {
                    Username = qs["username"],
                    Password = qs["password"],
                    Code = qs["currentPassword"],
                };
            }

            if (!ModelState.IsValid)
                return BadRequest();


            if (data.Username.IsNullOrWhiteSpace())
                return BadRequest("Invalid Username");


            var user = await securityManager.GetUserByUserNameAsync(data.Username).SafeAsync(Log);
            if (user == null)
                return Ok();


            var result = await registrationManager.UpdatePasswordAsync(user, data.Code, data.Password).SafeAsync(Log);
            if (result.IsSuccessful)
                return Ok();


            return BadRequest("Invalid Reset Code");
        }



        [HttpGet("users/me")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(UserViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetUser() => await GetUserByUserName(this.User.Identity.Name).SafeAsync(Log);


        [HttpGet("users/{id}", Name = nameof(GetUserById))]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(UserViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetUserById([FromQuery][Required] string id)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var result = await authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Read).SafeAsync(Log);
            if (!result.Succeeded)
                return new ChallengeResult();



            var vm = await getUserViewModelHelper(id).SafeAsync(Log);

            if (vm == null)
                return NotFound();

            return Ok(vm);
        }


        [HttpGet("users/username/{userName}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(UserViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetUserByUserName([FromQuery][Required] string userName)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var user = await securityManager.GetUserByUserNameAsync(userName).SafeAsync(Log);
            var id = user?.Id ?? "";


            var result = await authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Read).SafeAsync(Log);
            if (!result.Succeeded)
                return new ChallengeResult();

            if (user == null)
                return NotFound();


            var vm = await getUserViewModelHelper(id).SafeAsync(Log);

            if (vm == null)
                return NotFound();

            return Ok(vm);
        }


        [HttpGet("users")]
        [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<UserViewModel>))]
        public async Task<IActionResult> GetUsers() => await GetUsers(-1, -1);


        [HttpGet("users/{pageNumber:int}/{pageSize:int}")]
        [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<UserViewModel>))]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetUsers(int pageNumber, int pageSize)
        {
            var usersAndRoles = await securityManager.GetUsersAndRolesAsync(pageNumber, pageSize).SafeAsync(Log);
            if (usersAndRoles == null)
                return NotFound();


            var result = new List<UserViewModel>();
            foreach (var (user, roles) in usersAndRoles)
            {
                var vm = Mapper.Map<UserViewModel>(user);
                vm.Roles = roles;

                result.Add(vm);
            }

            return Ok(result);
        }


        [HttpPut("users/me")]
        [ProducesResponseType(typeof(UserEditViewModel), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> PutUser([FromBody][Required] UserPatchViewModel patch) //=> await PutUser(Utilities.GetUserId(this.User), editedUser);
		{
			if (!ModelState.IsValid)
				return BadRequest();

            var (accountNumber, response) = IsAuthorized();

            if (patch == null)
				return BadRequest($"{nameof(patch)} cannot be null");

			var id = Utilities.GetUserId(this.User);

			var appUser = await securityManager.GetUserByIdAsync(patch.Id).SafeAsync(Log);
			if (appUser == null)
				return NotFound(id);


			var userPVM = Mapper.Map<UserPatchViewModel>(appUser);
    


			Mapper.Map<UserPatchViewModel, ApplicationUser>(patch, appUser);

            // Fetch User's native language
            var userAccunt = await registrationManager.GetAccountAsync(appUser.AccountNumbers.SingleOrDefault()).SafeAsync(Log);
            appUser.Language = userAccunt?.Language;

            if (patch.CurrentPassword != null && patch.ConfirmPassword != null) 
                await registrationManager.UpdatePasswordAsync(appUser, patch.CurrentPassword, patch.ConfirmPassword,EmailTemplates.ChangePasswordEmail(appUser.Language),accountNumber);

            if (patch.Id != id && patch.ConfirmPassword != null && patch.CurrentPassword == null)
                await registrationManager.ResetPasswordByAdminAsync(appUser, patch.ConfirmPassword);

            var result = await securityManager.UpdateUserAsync(appUser).SafeAsync(Log);
			if (result.IsSuccessful)
				return NoContent();

            
            


			return BadRequest(result.Errors);
		}


        [HttpPut("users/{id}")]
        [ProducesResponseType(typeof(UserEditViewModel), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> PutUser([FromQuery][Required] string id, [FromBody][Required] UserEditViewModel editedUser)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (editedUser == null)
                return BadRequest($"{nameof(editedUser)} cannot be null");

            if (!string.IsNullOrWhiteSpace(editedUser.Id) && id != editedUser.Id)
                return BadRequest("Conflicting user id in parameter and model data");


            var user = await securityManager.GetUserByIdAsync(id).SafeAsync(Log);
            if (user == null)
                return NotFound(id);


            if (Utilities.GetUserId(this.User) == id)
            {
                var pwdCurrentIsEmpty = string.IsNullOrWhiteSpace(editedUser.CurrentPassword);
                var pwdNewIsEmpty = string.IsNullOrWhiteSpace(editedUser.NewPassword);
                var changeUsername = user.UserName != editedUser.UserName;

                if (pwdCurrentIsEmpty && !pwdNewIsEmpty)
                    return BadRequest("Current password is required when changing your own password");

                if (pwdCurrentIsEmpty && changeUsername)
                    return BadRequest("Current password is required when changing your own username");


                if (changeUsername || !pwdNewIsEmpty)
                {
                    var valid = await securityManager.CheckPasswordAsync(user, editedUser.CurrentPassword).SafeAsync(false, Log);
                    if (!valid)
                        return BadRequest("The password is incorrect");
                }
            }

			var currentRoles = await securityManager.GetUserRolesAsync(user);

			var manageUsersPolicy = authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update).SafeAsync(Log);
			var assignRolePolicy = authorizationService.AuthorizeAsync(this.User, Tuple.Create(editedUser.Roles, currentRoles), Authorization.Policies.AssignAllowedRolesPolicy).SafeAsync(Log);


			var notallowed = (await Task.WhenAll(manageUsersPolicy, assignRolePolicy).SafeAsync(Log)).Any(r => !r.Succeeded);
			if (notallowed)
				return Unauthorized();



			Mapper.Map<UserViewModel, ApplicationUser>(editedUser, user);

            var result = await securityManager.UpdateUserAsync(user, editedUser.Roles).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not update");


            if (string.IsNullOrWhiteSpace(editedUser.NewPassword))
                return Ok(Mapper.Map<UserEditViewModel>(result.Result));

            var passwordResult = (!string.IsNullOrWhiteSpace(editedUser.CurrentPassword))
                               ? await securityManager.UpdatePasswordAsync(user, editedUser.CurrentPassword, editedUser.NewPassword).SafeAsync(Log)
                               : await securityManager.ResetPasswordByAdminAsync(user, editedUser.NewPassword).SafeAsync(Log);

            if (!passwordResult.IsSuccessful)
                return BadRequest(passwordResult);

            return Ok(result.Result);
        }


        [HttpPatch("users/me")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		[ProducesResponseType((int)HttpStatusCode.Forbidden)]
		[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
		[ProducesResponseType((int)HttpStatusCode.NotFound)]
		[ProducesResponseType((int)HttpStatusCode.InternalServerError)]
		public async Task<IActionResult> PatchUser([FromBody] JsonPatchDocument<UserPatchViewModel> patch) => await PatchUser(Utilities.GetUserId(this.User), patch).SafeAsync(Log);


        [HttpPatch("users/{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		[ProducesResponseType((int)HttpStatusCode.Forbidden)]
		[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
		[ProducesResponseType((int)HttpStatusCode.NotFound)]
		[ProducesResponseType((int)HttpStatusCode.InternalServerError)]
		public async Task<IActionResult> PatchUser([FromQuery][Required] string id, [FromBody][Required] JsonPatchDocument<UserPatchViewModel> patch)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (patch == null)
                return BadRequest($"{nameof(patch)} cannot be null");

            if (!(await authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update).SafeAsync(Log)).Succeeded)
                return new ChallengeResult();


            var appUser = await securityManager.GetUserByIdAsync(id).SafeAsync(Log);
            if (appUser == null)
                return NotFound(id);


            var userPVM = Mapper.Map<UserPatchViewModel>(appUser);
            patch.ApplyTo(userPVM, ModelState);


            if (!ModelState.IsValid)
                return BadRequest();

            Mapper.Map<UserPatchViewModel, ApplicationUser>(userPVM, appUser);

            var result = await securityManager.UpdateUserAsync(appUser).SafeAsync(Log);
            if (result.IsSuccessful)
                return NoContent();


            return BadRequest(result.Errors);
        }


        [HttpGet("questions/{language}")]
        [AllowAnonymous]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<IdentityQuestion>))]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> ListQuestions(string language)
        {
            var result = await lookupManager.ListQuestionsAsync(language).SafeAsync(Log);

            return Ok(result);
        }




        [HttpPost("users")]
        [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
        [ProducesResponseType(201, Type = typeof(UserViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Register([FromBody] UserEditViewModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (user == null)
                return BadRequest($"{nameof(user)} cannot be null");


            if (!(await authorizationService.AuthorizeAsync(this.User, Tuple.Create(user.Roles, new string[] { }), Authorization.Policies.AssignAllowedRolesPolicy).SafeAsync(Log)).Succeeded)
                return new ChallengeResult();



            var appUser = Mapper.Map<ApplicationUser>(user);

            var result = await securityManager.CreateUserAsync(appUser, user.Roles, user.AccountNumber, user.NewPassword).SafeAsync(Log);
            //var (success, errorMsgs) = await accountManager.CreateUserAsync(appUser, user.Roles, user.NewPassword);
            if (!result.IsSuccessful)
                return BadRequest("Could not create user");


            var vm = await getUserViewModelHelper(appUser.Id).SafeAsync(Log);

            return CreatedAtAction(nameof(GetUserById), new { id = vm.Id }, vm);
        }




        [HttpDelete("users/{id}")]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteUser([Required] string id)
        {
            if (!(await authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Delete).SafeAsync(Log)).Succeeded)
                return new ChallengeResult();

            if (!await securityManager.TestCanDeleteUserAsync(id))
                return BadRequest("User cannot be deleted. Delete all orders associated with this user and try again");


            var appUser = await this.securityManager.GetUserByIdAsync(id).SafeAsync(Log);
            if (appUser == null)
                return NotFound();


            var vm = await getUserViewModelHelper(appUser.Id).SafeAsync(Log);
            if (vm == null)
                return NotFound();

            var result = await this.securityManager.DeleteUserAsync(appUser).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not delete user");

            return Ok(vm);
        }


        [HttpPut("users/unblock/{id}")]
        [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UnblockUser(string id)
        {
            var appUser = await this.securityManager.GetUserByIdAsync(id).SafeAsync(Log);

            if (appUser == null)
                return NotFound(id);

            appUser.LockoutEnd = null;
            var result = await this.securityManager.UpdateUserAsync(appUser).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not update user");

            return NoContent();
        }


        [HttpGet("users/me/preferences")]
        [ProducesResponseType(200, Type = typeof(string))]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserPreferences()
        {
            var userId = Utilities.GetUserId(this.User);


            var user = await this.securityManager.GetUserByIdAsync(this.User.Identity.Name).SafeAsync(Log);

            if (user != null)
                return Ok(user.Configuration);
            else
                return NotFound();
        }


        [HttpPut("users/me/preferences")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutUserPreferences([FromBody] string data)
        {
            var userId = Utilities.GetUserId(this.User);
            var user = await this.securityManager.GetUserByIdAsync(userId).SafeAsync(Log);

            if (user == null)
                return NotFound(userId);

            user.Configuration = data;
            var result = await securityManager.UpdateUserAsync(user).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not update user");


            return NoContent();
        }





        [HttpGet("roles/{id}", Name = nameof(GetRoleById))]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRoleById(string id)
        {
            var appRole = await securityManager.GetRoleByIdAsync(id);

            if (!(await authorizationService.AuthorizeAsync(this.User, appRole?.Name ?? "", Authorization.Policies.ViewRoleByRoleNamePolicy).SafeAsync(Log)).Succeeded)
                return new ChallengeResult();

            if (appRole == null)
                return NotFound();

            return await GetRoleByName(appRole.Name);
        }


        [HttpGet("roles/name/{name}")]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRoleByName(string name)
        {
            if (!(await authorizationService.AuthorizeAsync(this.User, name, Authorization.Policies.ViewRoleByRoleNamePolicy).SafeAsync(Log)).Succeeded)
                return new ChallengeResult();


            var vm = await getRoleViewModelHelper(name).SafeAsync(Log);
            if (vm == null)
                return NotFound();

            return Ok(vm);
        }


        [HttpGet("roles")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        public async Task<IActionResult> GetRoles() => await GetRoles(-1, -1).SafeAsync(Log);


        [HttpGet("roles/{pageNumber:int}/{pageSize:int}")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        public async Task<IActionResult> GetRoles(int pageNumber, int pageSize)
        {
            var roles = await securityManager.GetRolesWithRelatedAsync(pageNumber, pageSize).SafeAsync(Log);

            return Ok(Mapper.Map<List<RoleViewModel>>(roles));
        }


        [HttpPut("roles/{id}")]
        [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutRole([Required] string id, [FromBody][Required] RoleViewModel role)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            if (!string.IsNullOrWhiteSpace(role.Id) && id != role.Id)
                return BadRequest("Conflicting role id in parameter and model data");



            var appRole = await securityManager.GetRoleByIdAsync(id).SafeAsync(Log);
            if (appRole == null)
                return NotFound();


            Mapper.Map<RoleViewModel, ApplicationRole>(role, appRole);

            var result = await securityManager.UpdateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray()).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not update role");

            return NoContent();
        }


        [HttpPost("roles")]
        [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(201, Type = typeof(RoleViewModel))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> PostRole([FromBody][Required] RoleViewModel role)
        {
            if (!ModelState.IsValid)
                return BadRequest();



            var appRole = Mapper.Map<ApplicationRole>(role);
            var result = await securityManager.CreateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray()).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not create role");


            var vm = await getRoleViewModelHelper(appRole.Name).SafeAsync(Log);
            return CreatedAtAction(nameof(GetRoleById), new { id = vm.Id }, vm);
        }

        [HttpDelete("roles/{id}")]
        [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteRole([FromQuery][Required] string id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (id.IsNullOrWhiteSpace())
                return BadRequest();


            if (!await securityManager.TestCanDeleteRoleAsync(id).SafeAsync(false, Log))
                return BadRequest("Role cannot be deleted. Remove all users from this role and try again");


            var role = await this.securityManager.GetRoleByIdAsync(id).SafeAsync(Log);
            if (role == null)
                return NotFound();


            var vm = await getRoleViewModelHelper(role.Name).SafeAsync(Log);
            if (vm == null)
                return NotFound();

            var result = await this.securityManager.DeleteRoleAsync(role).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not delete role");

            return Ok(vm);
        }


        [HttpGet("permissions")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<PermissionViewModel>))]
        public IActionResult GetPermissions() => Ok(Mapper.Map<List<PermissionViewModel>>(ApplicationPermissions.AllPermissions));





        private async Task<UserViewModel> getUserViewModelHelper(string userId)
        {
            (ApplicationUser user, string[] roles) = await securityManager.GetUserAndRolesAsync(userId).SafeAsync((null, null), Log);
            if (user == null)
                return null;

            var vm = Mapper.Map<UserViewModel>(user);
            vm.Roles = roles;

            return vm;
        }
        private async Task<RoleViewModel> getRoleViewModelHelper(string roleName)
        {
            var role = await securityManager.GetRoleWithRelatedAsync(roleName).SafeAsync(Log);
            if (role != null)
                return Mapper.Map<RoleViewModel>(role);


            return null;
        }

    }
}

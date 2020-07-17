using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AspNet.Security.OpenIdConnect.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using AspNet.Security.OpenIdConnect.Server;
using OpenIddict.Core;
using AspNet.Security.OpenIdConnect.Primitives;
using ScentAir.Payment.Models;
using ScentAir.Payment.Impl;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using OpenIddict.Abstractions;
using OpenIddict.Server;
using Microsoft.AspNetCore.Authorization;
using OpenIddict.EntityFrameworkCore.Models;
using ScentAir.Payment.Helpers;
using Microsoft.Extensions.Logging;


// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860


namespace ScentAir.Payment.Controllers
{
    public class AuthorizationController : CommonController
    {
        private readonly IOptions<IdentityOptions> identityOptions;
        private readonly OpenIddictApplicationManager<OpenIddictApplication> applicationManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;

        public AuthorizationController(
            ILoggerFactory loggerFactory,
            IOptions<IdentityOptions> identityOptions,
            OpenIddictApplicationManager<OpenIddictApplication> applicationManager,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)
            : base(loggerFactory)
        {
            this.identityOptions = identityOptions;
            this.applicationManager = applicationManager;
            this.signInManager = signInManager;
            this.userManager = userManager;

        }


        [HttpPost("~/connect/token")]
        [Produces("application/json")]
        public async Task<IActionResult> Exchange(OpenIdConnectRequest request)
        {
            if (request.IsPasswordGrantType())
            {
                var user = await userManager.FindByEmailAsync(request.Username).IgnoreAsync()
                        ?? await userManager.FindByNameAsync(request.Username).IgnoreAsync();
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        //Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Please check that your username and password is correct"
                    });
                }

                // Ensure the user is enabled.
                if (!user.IsEnabled)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        //Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user account is disabled"
                    });
                }


                // Validate the username/password parameters and ensure the account is not locked out.
                var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, true).IgnoreAsync();

                // Ensure the user is not already locked out.
                if (result.IsLockedOut)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        //Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "You have exceeded the number of login attempts and the account has been locked. Please allow 1 hour for the account to unlock or Contact us"
                    });
                }

                // Reject the token request if two-factor authentication has been enabled by the user.
                if (result.RequiresTwoFactor)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Invalid login procedure"
                    });
                }

                // Ensure the user is allowed to sign in.
                if (result.IsNotAllowed)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user is not allowed to sign in"
                    });
                }

                if (!result.Succeeded)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        //Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Please check that your email and password is correct"
                    });
                }



                // Create a new authentication ticket.
                var ticket = await createTicketAsync(request, user).IgnoreAsync();
                if (ticket == null)
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.ServerError,
                        ErrorDescription = "Please Try again later"
                    });


                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType()) // request.IsAuthorizationCodeGrantType() || 
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await HttpContext.AuthenticateAsync(OpenIddictServerDefaults.AuthenticationScheme).IgnoreAsync();
                if (info == null)
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidRequestObject,
                        ErrorDescription = "The refresh token is no longer valid"
                    });


                // Retrieve the user profile corresponding to the refresh token.
                // Note: if you want to automatically invalidate the refresh token
                // when the user password/roles change, use the following line instead:
                // var user = _signInManager.ValidateSecurityStampAsync(info.Principal);
                var user = await userManager.GetUserAsync(info.Principal).IgnoreAsync();
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The refresh token is no longer valid"
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await signInManager.CanSignInAsync(user).IgnoreAsync())
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in"
                    });
                }

                // Create a new authentication ticket, but reuse the properties stored
                // in the refresh token, including the scopes originally granted.
                var ticket = await createTicketAsync(request, user).IgnoreAsync();
                if (ticket == null)
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.ServerError,
                        ErrorDescription = "Please Try again later"
                    });


                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }


            return BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported"
            });
        }

        private async Task<AuthenticationTicket> createTicketAsync(OpenIdConnectRequest request, ApplicationUser user)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await signInManager.CreateUserPrincipalAsync(user);

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(principal, new AuthenticationProperties(), OpenIddictServerDefaults.AuthenticationScheme);


            //if (!request.IsRefreshTokenGrantType())
            //{
            // Set the list of scopes granted to the client application.
            // Note: the offline_access scope must be granted
            // to allow OpenIddict to return a refresh token.
            ticket.SetScopes(new[]
            {
                OpenIdConnectConstants.Scopes.OpenId,
                OpenIdConnectConstants.Scopes.Email,
                OpenIdConnectConstants.Scopes.Phone,
                OpenIdConnectConstants.Scopes.Profile,
                OpenIdConnectConstants.Scopes.OfflineAccess,
                OpenIddictConstants.Scopes.Roles

            }.Intersect(request.GetScopes()));
            //}

            //ticket.SetResources("portal-api");

            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.

            foreach (var claim in ticket.Principal.Claims)
            {
                // Never include the security stamp in the access and identity tokens, as it's a secret value.
                if (claim.Type == identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                    continue;


                var destinations = new List<string> { OpenIdConnectConstants.Destinations.AccessToken };

                // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                // The other claims will only be added to the access_token, which is encrypted when using the default format.
                if ((claim.Type == OpenIdConnectConstants.Claims.Subject && ticket.HasScope(OpenIdConnectConstants.Scopes.OpenId)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)) ||
                    (claim.Type == Constants.ClaimTypes.Permission && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                }


                claim.SetDestinations(destinations);
            }


            var identity = principal.Identity as ClaimsIdentity;


            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Profile))
            {
                if (!string.IsNullOrWhiteSpace(user.Title))
                    identity.AddClaim(Constants.ClaimTypes.JobTitle, user.Title, OpenIdConnectConstants.Destinations.IdentityToken);

                if (!string.IsNullOrWhiteSpace(user.LastName))
                    identity.AddClaim(Constants.ClaimTypes.FullName, user.LastName, OpenIdConnectConstants.Destinations.IdentityToken);

                if (!string.IsNullOrWhiteSpace(user.Configuration))
                    identity.AddClaim(Constants.ClaimTypes.Configuration, user.Configuration, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Email))
            {
                if (!string.IsNullOrWhiteSpace(user.Email))
                    identity.AddClaim(Constants.ClaimTypes.Email, user.Email, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Phone))
            {
                if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                    identity.AddClaim(Constants.ClaimTypes.Phone, user.PhoneNumber, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            return ticket;
        }


        //[Authorize, HttpGet("~/connect/authorize")]
        //public async Task<IActionResult> Authorize(OpenIdConnectRequest request)
        //{
        //    // Retrieve the application details from the database.
        //    var application = await _applicationManager.FindByClientIdAsync(request.ClientId);
        //    if (application == null)
        //    {
        //        return BadRequest(new OpenIdConnectResponse
        //        {
        //            Error = OpenIdConnectConstants.Errors.InvalidClient,
        //            ErrorDescription = "Details concerning the calling client application cannot be found in the database"
        //        });
        //    }

        //    // Flow the request_id to allow OpenIddict to restore
        //    // the original authorization request from the cache.
        //    return base.Accepted(new OpenIdConnectResponse
        //    { 
        //        ApplicationName = await _applicationManager.GetDisplayNameAsync(application),
        //        RequestId = request.RequestId,
        //        Scope = request.Scope
        //    });
        //}

        //[Authorize, FormValueRequired("submit.Accept")]
        //[HttpPost("~/connect/authorize"), ValidateAntiForgeryToken]
        //public async Task<IActionResult> Accept(OpenIdConnectRequest request)
        //{
        //    // Retrieve the profile of the logged in user.
        //    var user = await _userManager.GetUserAsync(User);
        //    if (user == null)
        //    {
        //        return BadRequest(new OpenIdConnectResponse
        //        {
        //            Error = OpenIdConnectConstants.Errors.ServerError,
        //            ErrorDescription = "An internal error has occurred"
        //        });
        //    }

        //    // Create a new authentication ticket.
        //    var ticket = await createTicketAsync(request, user);

        //    // Returning a SignInResult will ask OpenIddict to issue the appropriate access/identity tokens.
        //    return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
        //}

        //[Authorize, FormValueRequired("submit.Deny")]
        //[HttpPost("~/connect/authorize"), ValidateAntiForgeryToken]
        //public IActionResult Deny()
        //{
        //    // Notify OpenIddict that the authorization grant has been denied by the resource owner
        //    // to redirect the user agent to the client application using the appropriate response_mode.
        //    return Forbid(OpenIddictServerDefaults.AuthenticationScheme);
        //}

        // Note: the logout action is only useful when implementing interactive
        // flows like the authorization code flow or the implicit flow.

        //[HttpGet("~/connect/logout")]
        //public IActionResult Logout(OpenIdConnectRequest request)
        //{
        //    Debug.Assert(request.IsLogoutRequest(),
        //        "The OpenIddict binder for ASP.NET Core MVC is not registered. " +
        //        "Make sure services.AddOpenIddict().AddServer().UseMvc() is correctly called.");

        //    // Flow the request_id to allow OpenIddict to restore
        //    // the original logout request from the distributed cache.
        //    return View(new LogoutViewModel
        //    {
        //        RequestId = request.RequestId
        //    });
        //}

        [HttpPost("~/connect/logout"), ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            // Ask ASP.NET Core Identity to delete the local and external cookies created
            // when the user agent is redirected from the external identity provider
            // after a successful authentication flow (e.g Google or Facebook).
            await signInManager.SignOutAsync().IgnoreAsync(Log.LogWarning);

            // Returning a SignOutResult will ask OpenIddict to redirect the user agent
            // to the post_logout_redirect_uri specified by the client application.
            return SignOut(OpenIddictServerDefaults.AuthenticationScheme);
        }



        //private IEnumerable<string> GetDestinations(Claim claim, AuthenticationTicket ticket)
        //{
        //    // Note: by default, claims are NOT automatically included in the access and identity tokens.
        //    // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
        //    // whether they should be included in access tokens, in identity tokens or in both.

        //    switch (claim.Type)
        //    {
        //        case OpenIddictConstants.Claims.Name:
        //            yield return OpenIddictConstants.Destinations.AccessToken;

        //            if (ticket.HasScope(OpenIddictConstants.Scopes.Profile))
        //                yield return OpenIddictConstants.Destinations.IdentityToken;

        //            yield break;

        //        case OpenIddictConstants.Claims.Email:
        //            yield return OpenIddictConstants.Destinations.AccessToken;

        //            if (ticket.HasScope(OpenIddictConstants.Scopes.Email))
        //                yield return OpenIddictConstants.Destinations.IdentityToken;

        //            yield break;

        //        case OpenIddictConstants.Claims.Role:
        //            yield return OpenIddictConstants.Destinations.AccessToken;

        //            if (ticket.HasScope(OpenIddictConstants.Scopes.Roles))
        //                yield return OpenIddictConstants.Destinations.IdentityToken;

        //            yield break;

        //        // Never include the security stamp in the access and identity tokens, as it's a secret value.
        //        case "AspNet.Identity.SecurityStamp": yield break;

        //        default:
        //            yield return OpenIddictConstants.Destinations.AccessToken;
        //            yield break;
        //    }
        //}

    }
}

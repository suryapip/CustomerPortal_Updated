using ScentAir.Payment.Impl;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment.Authorization
{
    public class ViewRoleAuthorizationRequirement : IAuthorizationRequirement
    {

    }



    public class ViewRoleAuthorizationHandler : AuthorizationHandler<ViewRoleAuthorizationRequirement, string>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ViewRoleAuthorizationRequirement requirement, string roleName)
        {
            if (context.User == null)
                return Task.CompletedTask;

            if (context.User.HasClaim(Constants.ClaimTypes.Permission, ApplicationPermissions.ViewRoles) || context.User.IsInRole(roleName))
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}

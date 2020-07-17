﻿using ScentAir.Payment.Impl;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ScentAir.Payment.Authorization
{
    public class AssignRolesAuthorizationRequirement : IAuthorizationRequirement
    {

    }



    public class AssignRolesAuthorizationHandler : AuthorizationHandler<AssignRolesAuthorizationRequirement, Tuple<string[], string[]>>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AssignRolesAuthorizationRequirement requirement, Tuple<string[], string[]> newAndCurrentRoles)
        {
            if (!areRolesChanged(newAndCurrentRoles.Item1, newAndCurrentRoles.Item2))
            {
                context.Succeed(requirement);
            }
            else if (context.User.HasClaim(Constants.ClaimTypes.Permission, ApplicationPermissions.AssignRoles))
            {
                if (context.User.HasClaim(Constants.ClaimTypes.Permission, ApplicationPermissions.ViewRoles)) // If user has ViewRoles permission, then he can assign any roles
                    context.Succeed(requirement);

                else if (isUserInAllAddedRoles(context.User, newAndCurrentRoles.Item1, newAndCurrentRoles.Item2)) // Else user can only assign roles they're part of
                    context.Succeed(requirement);
            }


            return Task.CompletedTask;
        }


        private bool areRolesChanged(string[] newRoles, string[] currentRoles)
        {
            if (newRoles == null)
                newRoles = new string[] { };

            if (currentRoles == null)
                currentRoles = new string[] { };


            bool roleAdded = newRoles.Except(currentRoles).Any();
            bool roleRemoved = currentRoles.Except(newRoles).Any();

            return roleAdded || roleRemoved;
        }


        private bool isUserInAllAddedRoles(ClaimsPrincipal contextUser, string[] newRoles, string[] currentRoles)
        {
            if (newRoles == null)
                newRoles = new string[] { };

            if (currentRoles == null)
                currentRoles = new string[] { };


            var addedRoles = newRoles.Except(currentRoles);

            return addedRoles.All(role => contextUser.IsInRole(role));
        }
    }
}
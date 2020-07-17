using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScentAir.Payment.Models
{
    public class ApplicationRole : IdentityRole<string>, IAuditableEntity
    {
        /// <summary>
        /// Initializes a new instance of <see cref="ApplicationRole"/>.
        /// </summary>
        /// <remarks>
        /// The Id property is initialized to from a new GUID string value.
        /// </remarks>
        public ApplicationRole() { }

        /// <summary>
        /// Initializes a new instance of <see cref="ApplicationRole"/>.
        /// </summary>
        /// <param name="roleName">The role name.</param>
        /// <param name="description">Description of the role.</param>
        /// <remarks>
        /// The Id property is initialized to from a new GUID string value.
        /// </remarks>
        public ApplicationRole(string roleName, string customerNumber = null, string description = null) : this(roleName, customerNumber, null, description) { }


        /// <summary>
        /// Initializes a new instance of <see cref="ApplicationRole"/>.
        /// </summary>
        /// <param name="roleName">The role name.</param>
        /// <param name="description">Description of the role.</param>
        /// <remarks>
        /// The Id property is initialized to from a new GUID string value.
        /// </remarks>
        public ApplicationRole(string roleName, string customerNumber, string accountNumber, string description) : base(roleName)
        {
            CustomerNumber = customerNumber ?? @"*";
            AccountNumber = accountNumber ?? @"*";
            Description = description;
        }





        public string CustomerNumber { get; set; }
        public string AccountNumber { get; set; }
        /// <summary>
        /// Gets or sets the description for this role.
        /// </summary>
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }



        /// <summary>
        /// Navigation property for the users in this role.
        /// </summary>
        public virtual ICollection<IdentityUserRole<string>> Users { get; set; }

        /// <summary>
        /// Navigation property for claims in this role.
        /// </summary>
        public virtual ICollection<IdentityRoleClaim<string>> Claims { get; set; }
    }
}

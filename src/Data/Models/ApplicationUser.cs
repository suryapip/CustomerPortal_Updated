using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ScentAir.Payment.Models
{
    public class ApplicationUser : IdentityUser, IAuditableEntity
    {
        [NotMapped]
        public virtual string GreetingName
        {
            get
            {
                string name = !string.IsNullOrWhiteSpace(Name) ? Name : UserName;

                var salutation = Salutation ?? "Mr(s).";

                return string.Join(" ", salutation, LastName);
            }
        }

        [NotMapped]
        public virtual string Name
        {
            get
            {
                return string.Join(
                    " ",
                    FirstName,
                    LastName);
            }
        }
        [NotMapped]
        public virtual string ProperName
        {
            get
            {
                return string.Join(
                    ", ",
                    string.Join(
                        " ",
                        Prefix,
                        FullName,
                        Suffix),
                    Accredidations);
            }
        }
        [NotMapped]
        public virtual string FullName
        {
            get
            {
                return string.Join(
                    ", ",
                    string.Join(
                        " ",
                        FirstName,
                        MiddleName),
                    LastName);
            }
        }
        [NotMapped]
        public virtual string OrderedName
        {
            get
            {
                return string.Join(
                    ", ",
                    LastName,
                    string.Join(
                        " ",
                        FirstName,
                        MiddleName));
            }
        }

        [NotMapped]
        public string Language { get; set; }

        public string Salutation { get; set; }
        public string Title { get; set; }

        public string Prefix { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Suffix { get; set; }
        public string Accredidations { get; set; }


        [NotMapped]
        public virtual ICollection<string> AccountNumbers
        {
            get 
            { 
                return Claims.Where(c => c.ClaimType == Constants.ClaimTypes.Account).Select(x => x.ClaimValue).ToArray(); 
            }
        }


        public string Configuration { get; set; }
        public bool IsEnabled { get; set; }


        [NotMapped]
        public bool IsLockedOut => this.LockoutEnabled && this.LockoutEnd >= DateTimeOffset.UtcNow;


        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }



        /// <summary>
        /// Navigation property for the roles this user belongs to.
        /// </summary>
        public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }

        /// <summary>
        /// Navigation property for the claims this user possesses.
        /// </summary>
        public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }

        public virtual int? Q1 { get; set; }
        public virtual int? Q2 { get; set; }


        public virtual IdentityQuestion Question01 { get; set; }
        public virtual IdentityQuestion Question02 { get; set; }

        public string A1 { get; set; }
        public string A2 { get; set; }
    }
}

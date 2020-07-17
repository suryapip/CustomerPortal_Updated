using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace ScentAir.Payment.ViewModels
{
    public class RegisterViewModel
    {
        public RegisterUserViewModel User { get; set; }

        [Required]
        public AccountViewModel Account { get; set; }
    }

    public class RegisterUserViewModel
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Name { get { return $"{FirstName} {LastName}"; } }
        public string NormalizedName { get { return $"{LastName}, {FirstName}"; } }


        public string Email { get; set; }

        public string JobTitle { get; set; }

        public string PhoneNumber { get; set; }

        public string Configuration { get; set; }

        public bool IsEnabled { get; set; }

        public bool IsLockedOut { get; set; }

        public string ConfirmPassword { get; set; }

        public string NewPassword { get; set; }


        public int? Question01 { get; set; }
        public string Answer01 { get; set; }
        public int? Question02 { get; set; }
        public string Answer02 { get; set; }


        //public ClaimViewModel[] Claims { get; set; }
        public RoleViewModel[] Roles { get; set; }
        public string AccountNumber { get; set; }
    }

}

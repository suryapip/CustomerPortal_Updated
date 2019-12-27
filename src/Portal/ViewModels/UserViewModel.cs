using ScentAir.Payment.Models;
using FluentValidation;
using ScentAir.Payment.Helpers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;


namespace ScentAir.Payment.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(64, MinimumLength = 2, ErrorMessage = "Username must be between 2 and 200 characters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "First name is required")]
        [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is required")]
        [MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
        public string LastName { get; set; }

        public string Name { get { return $"{FirstName} {LastName}"; } }
        public string NormalizedName { get { return $"{LastName}, {FirstName}"; } }



        [Required(ErrorMessage = "Email is required")]
        [StringLength(200, ErrorMessage = "Email must be at most 200 characters")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        public string JobTitle { get; set; }

        public string PhoneNumber { get; set; }

        public string Configuration { get; set; }

        public bool IsEnabled { get; set; }

        public bool IsLockedOut { get; set; }

        [Required(ErrorMessage = "First question is required")]
        public virtual int? Question01 { get; set; }
        [Required(ErrorMessage = "First Answer is required")]
        public virtual string Answer01 { get; set; }
        [Required(ErrorMessage = "Second question is required")]
        public virtual int? Question02 { get; set; }
        [Required(ErrorMessage = "Second Answer is required")]
        public virtual string Answer02 { get; set; }


        [MinimumCount(1, ErrorMessage = "Roles cannot be empty")]
        public string[] Roles { get; set; }


        public string AccountNumber { get; set; }
        //public ApplicationRole[] Roles { get; set; }
        //public ClaimViewModel[] Claims { get; set; }
    }


    ////Todo: ***Using DataAnnotations for validations until Swashbuckle supports FluentValidation***
    //public class UserViewModelValidator : AbstractValidator<UserViewModel>
    //{
    //    public UserViewModelValidator()
    //    {
    //        //Validation logic here
    //        RuleFor(user => user.UserName).NotEmpty().WithMessage("Username cannot be empty");
    //        RuleFor(user => user.Email).EmailAddress().NotEmpty();
    //        RuleFor(user => user.Password).NotEmpty().WithMessage("Password cannot be empty").Length(4, 20);
    //    }
    //}
}

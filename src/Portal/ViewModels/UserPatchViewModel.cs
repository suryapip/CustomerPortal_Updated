using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace ScentAir.Payment.ViewModels
{
    public class UserPatchViewModel 
	{
        public string Configuration { get; set; }


		[MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
		public string FirstName { get; set; }
		[MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
		public string LastName { get; set; }
        public string Id { get; set; }


		[StringLength(200, ErrorMessage = "Email must be at most 200 characters")]
		[EmailAddress(ErrorMessage = "Invalid email address")]
		public string Email { get; set; }

		public string JobTitle { get; set; }

		public string PhoneNumber { get; set; }

		//public bool IsEnabled { get; set; }

		//public bool IsLockedOut { get; set; }

		public virtual int? Question01 { get; set; }
		public virtual string Answer01 { get; set; }
		public virtual int? Question02 { get; set; }
		public virtual string Answer02 { get; set; }
        
        public string CurrentPassword { get; set; }
        public string ConfirmPassword { get; set; }

        public string UserName { get; set; }
	}
}

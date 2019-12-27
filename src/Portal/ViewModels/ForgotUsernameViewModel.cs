using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace ScentAir.Payment.ViewModels
{

    public class ForgotUsernameViewModel
    {
        public string AccountNumber { get; set; }

        public string EmailAddress { get; set; }
    }

}

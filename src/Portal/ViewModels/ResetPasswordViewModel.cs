using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScentAir.Payment.ViewModels
{
    public class ResetPasswordViewModel
    {
        public string Code { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

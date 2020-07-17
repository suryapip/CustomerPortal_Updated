using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ScentAir.Payment.ViewModels
{
    public class AccountViewModel
    {
        public string Number { get; set; }
        public string Pin { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public AddressViewModel Address { get; set; }
        public string Currency { get; set; }

    }
}

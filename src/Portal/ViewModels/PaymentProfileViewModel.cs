using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScentAir.Payment.ViewModels
{
    public class PaymentProfileViewModel
    {
        public string Id { get; set; }

        public string PaymentBillToName { get; set; }
        public string PaymentType { get; set; }
        public string Bank { get; set; }
        public string Currency { get; set; }


		public string Name { get; set; }
        public AddressViewModel Address { get; set; }

        public string CardNumber { get; set; }
        public string CardType { get; set; }
        public string CardCCV { get; set; }
        public string CardExpirationMonth { get; set; }
        public string CardExpirationYear { get; set; }

		public string AchAccountType { get; set; }
        public string AchAccountNumber { get; set; }
        public string AchRoutingNumber { get; set; }

        public bool CurrentAutoPayMethod { get; set; }
        public bool IsDefault { get; set; }
    }
}

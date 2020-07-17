using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScentAir.Payment.ViewModels
{
    public class PaymentViewModel
    {
        public string Id { get; set; }
        public string PaymentType { get; set; }
        public string Name { get; set; }
        public string AccountNumber { get; set; }
        public bool CurrentAutoPayMethod { get; set; }

        public string PaymentBillToName { get; set; }

        public bool isDefault { get; set; }
    }
}

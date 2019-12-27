using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScentAir.Payment.ViewModels
{
    public class PaymentRequestViewModel
    {
        public ICollection<string> Invoices { get; set; }
        public decimal PaymentAmount { get; set; }
    }
}

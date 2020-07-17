using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScentAir.Payment.ViewModels
{
    public class PaymentResultViewModel : PaymentRequestViewModel
    {
        public string ProcessorStatus { get; set; }
        public string ApprovalStatus { get; set; }
        public string ConfirmationNumber { get; set; }
        public string Message { get; set; }
    }
}

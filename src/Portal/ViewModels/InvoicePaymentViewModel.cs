using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment.ViewModels
{
    public class InvoicePaymentViewModel 
    {
        public decimal Amount { get; set; }

        public string Status { get; set; }

        public string CheckNumber { get; set; }
        public string ReferenceNumber { get; set; }
        public string Result { get; set; }

        public DateTimeOffset? DateAuthorized { get; set; }
        public DateTimeOffset? DateScheduled { get; set; }
    }
}

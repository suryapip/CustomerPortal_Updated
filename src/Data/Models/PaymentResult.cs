using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace ScentAir.Payment.Models
{
    public class PaymentResult : Impl.AuditableEntity
    {
        public string ProcessorStatus { get; set; }
        public string ApprovalStatus { get; set; }
        public string ConfirmationNumber { get; set; }
        public string Message { get; set; }

        public string CustomerProfile { get; set; }
    }
}

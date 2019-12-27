using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ScentAir.Payment.Models
{
    public class InvoicePayment : Impl.AuditableEntity
    {
        public virtual Invoice Invoice { get; set; }
        public virtual PaymentMethod PaymentMethod { get; set; }


        [Required]
        [StringLength(20)]
        public string InvoiceNumber { get; set; }


        private decimal amount,
                        transactionAmount;

        public decimal TransactionAmount { get { return this.transactionAmount; } set { this.transactionAmount = Math.Round(value, 2); } }
        public decimal Amount { get { return this.amount; } set { this.amount = Math.Round(value, 2); } }

        [EnumDataType(typeof(InvoicePaymentStatus))]
        public InvoicePaymentStatus Status { get; set; }
        public string CheckNumber { get; set; }

        public string ApprovalStatus { get; set; }
        public string ProcessorStatus { get; set; }
        public string TransactionNumber { get; set; }
        public string ConfirmationNumber { get; set; }

        public string ChaseResponse { get; set; }

        public DateTimeOffset? DateAuthorized { get; set; }
        public DateTimeOffset? DateScheduled { get; set; }
        public DateTimeOffset? DateFinalized { get; set; }


        [Timestamp]
        public byte[] RowVersion { get; set; }

        public bool IsAcceptedPayTC {get; set;}

        
    }
}

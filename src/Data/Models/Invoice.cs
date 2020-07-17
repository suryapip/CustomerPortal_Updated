using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment.Models
{
    public class Invoice : Impl.AuditableEntity
    {
        [StringLength(15)]
        public string SoldToAccountNumber { get; internal set; }
        [StringLength(15)]
        public string BilledToAccountNumber { get; internal set; }


        public virtual Company SellingEntity { get; set; }
        public virtual Company BillingEntity { get; set; }

        public virtual Account BilledToAccount { get; set; }
        public virtual Account SoldToAccount { get; set; }


        [Column(TypeName = "binary(12)")]
        public byte[] ExternalRowVersion { get; set; }

        [Column(TypeName = "binary(8)")]
        public byte[] ExternalRowVersion1 { get; set; }

        [Required]
        [StringLength(20)]
        public string InvoiceNumber { get; set; }
        public DateTimeOffset InvoiceDate { get; set; }

        [StringLength(40)]
        public string CustomerReferenceNumber { get; set; }
        [StringLength(30)]
        public string CustomerPurchaseOrderNumber { get; set; }
        


        public virtual Address ShippingAddress { get; set; }
        [StringLength(60)]
        public string  ShippingNumber { get; set; }
        [StringLength(60)]
        public string  ShippingMethod { get; set; }
        [StringLength(60)]
        public string  ShippingResult { get; set; }



        public DateTimeOffset? ServiceFrom { get; set; }
        public DateTimeOffset? ServiceTo { get; set; }
        public DateTimeOffset? DateDue { get; internal set; }

        [StringLength(80)]
        public string IncoTerms { get; internal set; }
        [StringLength(80)]
        public string PaymentTerms { get; set; }
        [Column(TypeName = "ntext")]
        public string Comments { get; set; }


        [StringLength(20)]
        public string TaxId { get; set; }
        public decimal TaxRate { get; set; }
        [StringLength(3)]
        public string Currency { get; set; }


		private decimal discountAmount,
						subTotalAmount,
						taxAmount,
						balance,
#pragma warning disable CS0169 // The field 'Invoice.pendingBalance' is never used
						pendingBalance,
#pragma warning restore CS0169 // The field 'Invoice.pendingBalance' is never used
						total;

		public decimal DiscountAmount { get { return this.discountAmount; } set { this.discountAmount = Math.Round(value, 2); } }
		public decimal SubTotalAmount { get { return this.subTotalAmount; } set { this.subTotalAmount = Math.Round(value, 2); } }
		public decimal Total { get { return this.total; } set { this.total = Math.Round(value, 2); } }
        public decimal TaxAmount { get { return this.taxAmount; } set { this.taxAmount = Math.Round(value, 2); } }
		public decimal Balance { get { return this.balance; } set { this.balance = Math.Round(value, 2); } }
		[StringLength(3)]
        public string BalanceCurrency { get; internal set; }


        [NotMapped]
        public decimal PendingBalance { get; set; }
        [NotMapped]
        public decimal TotalAmount { get { return Math.Round(SubTotalAmount + TaxAmount, 2); } }
        //[NotMapped]
        //public decimal TotalAmountPaid { get { return Math.Round(Math.Round(TotalAmount - Balance, 2) + PendingBalance, 2); } }
        [NotMapped]
        public decimal TotalAmountPaid { get { return (Math.Round(PendingBalance, 2) + Total) * -1; } }

        [NotMapped]
        public InvoiceStatus Status
        {
            get
            {
                var paymentStatus = (TotalAmount == 0
                                  ? InvoiceStatus.Cancelled
                                  : PendingBalance > 0 
                                  ? InvoiceStatus.PaymentPending
                                  : Balance == 0
                                  ? InvoiceStatus.PaidInFull
                                  : Balance >= 0
                                  ? InvoiceStatus.Due
                                  : InvoiceStatus.PaidInPart);

                var lateStatus = (DateDue ?? DateTimeOffset.MinValue) < DateTimeOffset.Now &&
                                 ((paymentStatus & InvoiceStatus.PaidInPart) == InvoiceStatus.PaidInPart ||
                                  (paymentStatus & InvoiceStatus.Due) == InvoiceStatus.Due)
                               ? paymentStatus | InvoiceStatus.Overdue
                               : paymentStatus;

                return lateStatus;
            }
        }



        public virtual ICollection<InvoiceDetail> Details { get; set; }
        public virtual ICollection<InvoiceTax> Taxes { get; set; }
        public virtual ICollection<InvoicePayment> Payments { get; set; }
        
    }
}

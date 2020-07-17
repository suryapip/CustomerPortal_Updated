using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScentAir.Payment.Models
{
    public class PaymentMethod : Impl.AuditableEntity
    {
        public Guid Id { get; set; }
        [Required]
        [StringLength(15)]
        public string AccountNumber { get; set; }
        public virtual Account Account { get; set; }


        public string TokenSource { get; set; }
        public string Token { get; set; }



        public string Name { get; set; }
        [EnumDataType(typeof(PaymentType))]
        public PaymentType PaymentType { get; set; }


        public string CCV { get; set; }
        public string PaymentBillToName { get; set; }
        public virtual Address PaymentBillingAddress { get; set; }
        public string PaymentAccountNumber { get; set; }
        public string PaymentRoutingNumber { get; set; }
        public DateTimeOffset? ExpiresOn { get; set; }

        public string Bank { get; set; }
        public string Branch { get; set; }
        public string Currency { get; set; }

        public bool IsDeleted { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsDefault { get; set; }
        public bool IsAuto { get; internal set; }
            
        public bool IsAcceptedAutoTC { get; set; }
    }
}
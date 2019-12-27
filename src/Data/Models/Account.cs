using ScentAir.Payment.Impl;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment.Models
{

    public class Account : Impl.AuditableEntity
    {
        [Key]
        [StringLength(15)]
        public string Number { get; set; }
        [StringLength(15)]
        public string Pin { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(84)]
        public string PhoneNumber { get; set; }
        [StringLength(84)]
        public string FaxNumber { get; set; }

        [StringLength(3)]
        public string Currency { get; set; }

        [StringLength(20)]
        public string TaxId { get; set; }

        [StringLength(20)]
        public string TaxPrefix { get; set; }

        [StringLength(3)]
        public string Language { get; set; }

        public virtual Address PhysicalAddress { get; set; }
        public virtual Address MailingAddress { get; set; }
        public virtual Address BillingAddress { get; set; }
        public virtual Address ShippingAddress { get; set; }


        [StringLength(50)]
        public string SalesPerson { get; set; }
        [StringLength(50)]
        public string AccountRepresentative { get; set; }

        [Column(TypeName ="binary(12)")]
        public byte[] ExternalRowVersion { get; set; }


        //[InverseProperty("Accounts")]
        public virtual Company Company { get; set; }
        //[InverseProperty("SoldToAccount")]
        public virtual ICollection<Invoice> InvoicesAsReceiver { get; set; }
        //[InverseProperty("BilledToAccount")]
        public virtual ICollection<Invoice> InvoicesAsPayor { get; set; }
        //[InverseProperty("Account")]
        public virtual ICollection<PaymentMethod> PaymentMethods { get; set; }
        //[InverseProperty("Account")]
        //public IEnumerable<ApplicationUser> Users { get; internal set; }
    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScentAir.Payment.Models
{
    public class Company: Impl.AuditableEntity
    {
        [Key]
        [StringLength(15)]
        public string Number { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(84)]
        public string PhoneNumber { get; set; }
        [StringLength(84)]
        public string FaxNumber { get; set; }

        [StringLength(60)]
        public string WireName { get; internal set; }
        [StringLength(60)]
        public string WireBank { get; set; }
        [StringLength(60)]
        public string WireBranch { get; internal set; }
        [StringLength(40)]
        public string WireAccountNumber { get; set; }
        [StringLength(30)]
        public string WireRoutingNumber { get; set; }
        [StringLength(3)]
        public string Currency { get; set; }

        [StringLength(400)]
        public string TaxId { get; set; }

        [StringLength(30)]
        public string TaxIdPrefix { get; set; }

        [StringLength(20)]
        public string KvkNumber { get; set; }


        public virtual Address PhysicalAddress { get; set; }
        public virtual Address MailingAddress { get; set; }
        public virtual Address BillingAddress { get; set; }
        public virtual Address ShippingAddress { get; set; }


        [Column(TypeName ="binary(12)")]
        public byte[] ExternalRowVersion { get; set; }


        public virtual ICollection<ApplicationUser> Users { get; set; }
        //[InverseProperty("Company")]
        public virtual ICollection<Account> Accounts { get; set; }
    }
}
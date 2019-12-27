using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ScentAir.Payment.Models
{
    public class CompanyWireAchDetail : Impl.AuditableEntity
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string InvoiceNumber { get; set; }

        [StringLength(450)]
        public string WireName { get; set; }

        [StringLength(450)]
        public string WireBank { get; set; }

        [StringLength(450)]
        public string WireBranch { get; set; }

        [StringLength(60)]
        public string WireBankId { get; set; }

        [StringLength(450)]
        public string WireAccountNumber { get; set; }

        [StringLength(450)]
        public string WireRoutingNumber { get; set; }


        [StringLength(450)]
        public string RemitSortcode { get; set; }

        [StringLength(450)]
        public string RemitBan { get; set; }

        [StringLength(7)]
        public string SwiftName { get; set; }

        [StringLength(18)]
        public string Swift { get; set; }

        [StringLength(450)]
        public string WireClearing { get; set; }


        [StringLength(450)]
        public string WireCurrency { get; set; }

        [StringLength(450)]
        public string WireName2 { get; set; }

        [StringLength(450)]
        public string WireBank2 { get; set; }


        [StringLength(30)]
        public string WireAccount2 { get; set; }

        [StringLength(18)]
        public string Swift2 { get; set; }

        [StringLength(450)]
        public string WireCurrency2 { get; set; }

        public virtual Invoice Invoice { get; set; }

        [Column(TypeName = "binary(12)")]
        public byte[] ExternalRowVersion { get; set; }
    }
}

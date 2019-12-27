using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScentAir.Payment.Models
{
    public class InvoiceHeaderExtension : Impl.AuditableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string InvoiceNumber { get; set; }

        [Required]
        [StringLength(2)]
        public string Logo { get; set; }

        [Required]
        [StringLength(11)]
        public string DocType { get; set; }

        [StringLength(3)]
        public string InvoiceCurrency { get; set; }

        public string Memo { get; set; }

        [StringLength(18)]
        public string PdcrAmount { get; set; }

        public string PaymentReference { get; set; }

        public string CheckNumber { get; set; }

        public double? PayAmount { get; set; }

        [StringLength(80)]
        public string ImporteTOT { get; set; }

        [StringLength(15)]
        public string PayByCustomer { get; set; }

        [StringLength(35)]
        public string PayByName { get; set; }

        [StringLength(10)]
        public string CPY { get; set; }

        public virtual Address PayByAddress { get; set; }

        [StringLength(450)]
        public string RemitCurrency { get; set; }

        [StringLength(450)]
        public string RemitName { get; set; }

        public virtual Address RemitAddress { get; set; }

        [StringLength(250)]
        public string BillToName { get; set; }

        public virtual Address BillToAddress { get; set; }

        [StringLength(250)]
        public string ShipToName { get; set; }

        public virtual Address ShipToAddress { get; set; }


        [StringLength(20)]
        public string CustTaxId { get; set; }

        [StringLength(20)]
        public string CustTaxPrefix { get; set; }
        

        [Column(TypeName = "binary(12)")]
        public byte[] ExternalRowVersion { get; set; }

        public virtual Invoice Invoice { get; set; }

    }
}

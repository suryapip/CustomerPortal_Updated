using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace ScentAir.Payment.Models
{
    public class InvoiceDetail : Impl.AuditableEntity
    {
        [StringLength(20)]
        public string InvoiceNumber { get; set; }        
        public int LineNumber { get; set; }

        [StringLength(20)]
        public string Item { get; set; }
        [StringLength(30)]
        public string Description { get; set; }



        public decimal UnitPrice { get; set; }
        public decimal UnitDiscount { get; set; }
        public decimal Quantity { get; set; }
        public decimal Discount { get; set; }
        public decimal ExtraAmount { get; internal set; }

        public decimal LineTaxRate { get; set; }

        public decimal Amount { get { return Math.Round((UnitPrice - UnitDiscount) * Quantity - Discount + ExtraAmount, 2); } }

        [Column(TypeName = "binary(12)")]
        public byte[] ExternalRowVersion { get; set; }

        //[InverseProperty("Details")]
        public virtual Invoice Invoice { get; set; }
    }
}

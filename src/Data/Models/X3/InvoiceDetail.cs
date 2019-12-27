using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScentAir.Payment.Models.X3
{
    [Table("INVOICE_DETAILS_PHASE2")]
    public partial class InvoiceDetail
    {
        [Column("NUMBER")]
        [StringLength(20)]
        public string InvoiceNumber { get; set; }
        [Column("LINENUMBER")]
        public int LineNumber { get; set; }

        [Required]
        [Column("ITEM")]
        [StringLength(20)]
        public string Item { get; set; }

        [Required]
        [Column("ITEMDESC")]
        [StringLength(30)]
        public string Description { get; set; }

        [Column("QTY", TypeName = "decimal(28, 13)")]
        public decimal Quantity { get; set; }
        [Column("PRICE", TypeName = "decimal(19, 5)")]
        public decimal UnitPrice { get; set; }
        [Column("EXTAMT", TypeName = "decimal(38, 8)")]
        public decimal? Total { get; set; }

        [Column("LINETAXRATE", TypeName = "numeric(8, 3)")]
        public decimal? LineTaxRate { get; set; }


        [Timestamp]
        public byte[] RowVersion { get; set; }

        [ForeignKey("Number")]
        [InverseProperty("InvoiceDetails")]
        public virtual Invoice Invoice { get; set; }
    }
}

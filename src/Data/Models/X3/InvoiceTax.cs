using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScentAir.Payment.Models.X3
{
    [Table("INVOICE_TAXES")]
    public partial class InvoiceTax
    {
        [Column("NUM_0")]
        [StringLength(20)]
        public string InvoiceNumber { get; set; }

        [Column("BPR_0")]
        [StringLength(20)]
        public string BPR { get; set; }

        [Column("TAXDESC")]
        [StringLength(122)]
        public string TaxDesc { get; set; }

        [Column("TAXAMT", TypeName = "decimal(28, 13)")]
        public decimal? TaxAmt { get; set; }
 
        //
        //   [ForeignKey("NUM_0")]
        //  public virtual Invoice Invoice { get; set; }


    }
}

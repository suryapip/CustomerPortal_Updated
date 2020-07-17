using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ScentAir.Payment.Models
{
    public class InvoiceTax: Impl.AuditableEntity
    {
        public virtual Invoice Invoice { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string InvoiceNumber { get; set; }


		private decimal taxAmount;

        public decimal TaxAmount { get { return this.taxAmount; } set { this.taxAmount = Math.Round(value, 2); } }

        public string TaxDesc { get; set; }
        public string BPR { get; set; }


        
    }
}

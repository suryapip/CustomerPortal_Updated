using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScentAir.Payment.Models.X3
{
    [Table("CUSTOMER_PHASE2")]
    public partial class Customer
    {
        public Customer()
        {
            InvoiceAsSoldTo = new HashSet<Invoice>();
        }

        [Key]
        [StringLength(15)]
        public string CustomerNumber { get; set; }

        [StringLength(50)]
        [Column("CustomerPin")]
        public string PinNumber { get; set; }
        [Required]
        [StringLength(60)]
        [Column("CustomerName")]
        public string Name { get; set; }
        [Required]
        [StringLength(50)]
        public string Address1 { get; set; }
        [Required]
        [StringLength(50)]
        public string Address2 { get; set; }
        [Required]
        [StringLength(50)]
        public string Address3 { get; set; }
        [Required]
        [StringLength(40)]
        public string City { get; set; }
        [Required]
        [StringLength(35)]
        public string State { get; set; }
        [Required]
        [StringLength(10)]
        public string PostalCode { get; set; }
        [Required]
        [StringLength(40)]
        [Column("CountryName")]
        public string Country { get; set; }
        [Required]
        [StringLength(80)]
        [Column("PhoneNumber")]
        public string Phone { get; set; }
        [StringLength(80)]
        [Column("Currency")]
        public string Currency { get; set; }

        [Column("Language")]
        [StringLength(3)]
        public string Language { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }



        //[InverseProperty("SoldTo")]
        public virtual ICollection<Invoice> InvoiceAsSoldTo { get; set; }
        public virtual ICollection<Invoice> InvoiceAsBilledTo { get; set; }
    }
}

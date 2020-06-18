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

    public class SFAccountSettings : Impl.AuditableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(15)]
        public string AccountNumber { get; set; }
        //public virtual Account Account { get; set; }
        //public virtual Address BillingAddress { get; set; }
        //public virtual Address ShippingAddress { get; set; }
        //public virtual ICollection<SFContact> Contacts { get; set; }

        [Required]
        [StringLength(50)]
        public string BillingLine1 { get; set; }
        [StringLength(50)]
        public string BillingLine2 { get; set; }
        [StringLength(50)]
        public string BillingLine3 { get; set; }
        [Required]
        [StringLength(100)]
        public string BillingMunicipality { get; set; }
        [Required]
        [StringLength(35)]
        public string BillingStateOrProvince { get; set; }
        [Required]
        [StringLength(10)]
        public string BillingPostalCode { get; set; }
        [Required]
        [StringLength(40)]
        public string BillingCountry { get; set; }

        [Required]
        [StringLength(50)]
        public string ShippingLine1 { get; set; }
        [StringLength(50)]
        public string ShippingLine2 { get; set; }
        [StringLength(50)]
        public string ShippingLine3 { get; set; }
        [Required]
        [StringLength(100)]
        public string ShippingMunicipality { get; set; }
        [Required]
        [StringLength(35)]
        public string ShippingStateOrProvince { get; set; }
        [Required]
        [StringLength(10)]
        public string ShippingPostalCode { get; set; }
        [Required]
        [StringLength(40)]
        public string ShippingCountry { get; set; }

        //[Required]
        //public string AccountNumber { get; set; }

        //public virtual Account Account { get; set; }
        ////public virtual Address BillingAddress { get; set; }
        ////public virtual Address ShippingAddress { get; set; }
        ////public virtual ICollection<SFContact> Contacts { get; set; }

        //public string BillingLine1 { get; set; }
        //public string BillingLine2 { get; set; }
        //public string BillingLine3 { get; set; }
        //public string BillingMunicipality { get; set; }
        //public string BillingStateOrProvince { get; set; }
        //public string BillingPostalCode { get; set; }
        //public string BillingCountry { get; set; }

        //public string ShippingLine1 { get; set; }
        //public string ShippingLine2 { get; set; }
        //public string ShippingLine3 { get; set; }
        //public string ShippingMunicipality { get; set; }
        //public string ShippingStateOrProvince { get; set; }
        //public string ShippingPostalCode { get; set; }
        //public string ShippingCountry { get; set; }
    }
}

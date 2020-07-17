using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;

namespace ScentAir.Payment.Models
{
    public class Address : IEquatable<Address>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Line1 { get; set; }
        [StringLength(50)]
        public string Line2 { get; set; }
        [StringLength(50)]
        public string Line3 { get; set; }

        [Required]
        [StringLength(100)]
        public string Municipality { get; set; }
        [Required]
        [StringLength(35)]
        public string StateOrProvince { get; set; }
        [Required]
        [StringLength(10)]
        public string PostalCode { get; set; }
        [Required]
        [StringLength(40)]
        public string Country { get; set; }

        public bool Equals(Address other) =>
            Equals(Country, other.Country) &&
            Equals(StateOrProvince, other.StateOrProvince) &&
            Equals(Municipality, other.Municipality) &&
            Equals(PostalCode, other.PostalCode) &&
            Equals(Line3, other.Line3) && 
            Equals(Line2, other.Line2) &&
            Equals(Line1, other.Line1);


        public override bool Equals(object obj) =>
            obj is Address ? Equals((Address)obj) : false;

        public override int GetHashCode() => base.GetHashCode();
    }
}

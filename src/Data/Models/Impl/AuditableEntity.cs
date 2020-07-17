using System;
using System.ComponentModel.DataAnnotations;

namespace ScentAir.Payment.Models.Impl
{
    public class AuditableEntity : IAuditableEntity
    {
        [Required]
        [MaxLength(256)]
        public string CreatedBy { get; set; }
        [Required]
        public DateTimeOffset CreatedOn { get; set; }


        [MaxLength(256)]
        public string ModifiedBy { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }
    }
}

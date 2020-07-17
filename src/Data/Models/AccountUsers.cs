using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment.Models
{
    public class AccountUsers : Impl.AuditableEntity
    {
        public virtual Account Account { get; set; }
        public virtual ApplicationUser User { get; set; }

        public bool IsActive { get; set; }
    }
}

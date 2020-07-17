using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment.Models
{
    public interface IAuditableEntity
    {
        string CreatedBy { get; set; }
        string ModifiedBy { get; set; }

        DateTimeOffset CreatedOn { get; set; }
        DateTimeOffset? ModifiedOn { get; set; }
    }
}

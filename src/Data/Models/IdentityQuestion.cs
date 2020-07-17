using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment.Models
{
    public class IdentityQuestion
    {
        public int Id { get; set; }

        public string Question { get; set; }

        public int Order { get; set; }

        public string Language { get; set; }

        public int ReferenceEnglishId { get; set; }
    }
}

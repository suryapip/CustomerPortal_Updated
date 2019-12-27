using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment.Models
{
    public class Resource : Impl.AuditableEntity
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public virtual ICollection<Item> Items { get; set; }


        public class Item : Impl.AuditableEntity
        {
            public Guid Id { get; set; }

            public string Name { get; set; }

            public virtual Resource Group { get; set; }
            public virtual ICollection<CultureValue> Values { get; set; }
        }
        public class CultureValue : Impl.AuditableEntity
        {
            public Guid Id { get; set; }


            public string CultureInfo { get; set; }            
            public string Translation { get; set; }

            public virtual Item Item { get; set; }
        }
    }
}

using System.Collections.Generic;
using System.Collections.Specialized;

namespace ScentAir.Payment.ViewModels
{
    public class AddressViewModel
    {
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string Line3 { get; set; }

        public string Municipality { get; set; }
        public string StateOrProvince { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
    }
}

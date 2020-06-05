using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ScentAir.Payment.ViewModels
{
    public class SFAccountSettingsViewModel
    {
        //public AccountViewModel Account { get; set; }
        //public int Id { get; set; }
        //public AddressViewModel BillingAddress { get; set; }
        //public AddressViewModel ShippingAddress { get; set; }
        public string AccountNumber { get; set; }
        public string BillingLine1 { get; set; }
        public string BillingLine2 { get; set; }
        public string BillingLine3 { get; set; }
        public string BillingMunicipality { get; set; }
        public string BillingStateOrProvince { get; set; }
        public string BillingPostalCode { get; set; }
        public string BillingCountry { get; set; }
        public string ShippingLine1 { get; set; }
        public string ShippingLine2 { get; set; }
        public string ShippingLine3 { get; set; }
        public string ShippingMunicipality { get; set; }
        public string ShippingStateOrProvince { get; set; }
        public string ShippingPostalCode { get; set; }
        public string ShippingCountry { get; set; }

    }
}

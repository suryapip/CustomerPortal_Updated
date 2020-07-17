using System.Collections.Generic;

namespace ScentAir.Payment.ViewModels
{
    public class CompanyViewModel : AccountViewModel
    {
        public string Bank { get; set; }
        public string AccountNumber { get; set; }
        public string RoutingNumber { get; set; }
#pragma warning disable CS0108 // 'CompanyViewModel.Currency' hides inherited member 'AccountViewModel.Currency'. Use the new keyword if hiding was intended.
        public string Currency { get; set; }
#pragma warning restore CS0108 // 'CompanyViewModel.Currency' hides inherited member 'AccountViewModel.Currency'. Use the new keyword if hiding was intended.


        public virtual AddressViewModel MailingAddress { get; set; }
        public virtual AddressViewModel BillingAddress { get; set; }
        public virtual AddressViewModel ShippingAddress { get; set; }
    }
}
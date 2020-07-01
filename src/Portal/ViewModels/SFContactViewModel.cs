namespace ScentAir.Payment.ViewModels
{
    public class SFContactViewModel
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool MainContact { get; set; }
        public bool BillingContact { get; set; }
        public bool ShippingContact { get; set; }
        public bool ServiceContact { get; set; }
        public bool PropertyContact { get; set; }
        public bool InstallationContact { get; set; }
        public bool MarketingContact { get; set; }
        public bool DoNotCall { get; set; }
        public bool DoNotEmail { get; set; }
        public bool Active { get; set; }
    }
}

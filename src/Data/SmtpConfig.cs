namespace ScentAir.Payment
{
    public class SmtpConfig
    {
        public bool UseSendGridEmail { get; set; }
        public string SendGridEmailApiKey { get; set; }

        public bool Disabled { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }

        public string Name { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}

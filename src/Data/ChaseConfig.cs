using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment
{
    public class ChaseConfig
    {
        public string RequestApi { get; set; }
        public string[] SoapApi { get; set; }
        public string HostedPaymentForm { get; set; }
        public string Gateway { get; set; }
        public MerchantAccount USD { get; set; }
        public MerchantAccount CAD { get; set; }
        public bool Disabled { get; set; }
        public int NewOrderRetry { get; set; }
    }

    public class MerchantAccount
    {
        public string ApiToken { get; set; }
        public string MerchantId { get; set; }
        public string AccountId { get; set; }
        public string Uid { get; set; }
        public string Pwd { get; set; }
        public bool Disabled { get; set; }
    }
}

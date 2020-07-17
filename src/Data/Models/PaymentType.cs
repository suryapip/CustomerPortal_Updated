namespace ScentAir.Payment.Models
{
    public enum PaymentType : int
    {
        Unknown		     = 0,
        ECP				 = (1 << 7),				// 00000000 10000000
		Checking		 = (1 << 1) | ECP,			// 00000000 10000010
		BusinessChecking = Checking | 1,			// 00000000 10000011
		Savings			 = (1 << 2) | ECP,			// 00000000 10000100

		CreditCard		 = (1 << 14),				// 01000000 00000000
		//PurchaseCard	 = (1 << 13) | CreditCard,	// 01100000 00000000
        MasterCard		 = (1 << 8) | CreditCard,   // 0??00001 00000000
		Visa			 = (1 << 9) | CreditCard,   // 0??00010 00000000
		AmericanExpress  = (1 << 10) | CreditCard,  // 0??00100 00000000
		Discover		 = (1 << 11) | CreditCard,  // 0??01000 00000000
        Diners           = (1 << 12) | CreditCard,
        JCB              = (1 << 13) | CreditCard,
	}
}
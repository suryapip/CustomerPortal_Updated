namespace ScentAir.Payment.Models
{
    public enum InvoicePaymentStatus : int
    {
		Unknown = 0,

		Scheduled = 128,
        Pending = 16,
        Processed = 32,
        Paid = 1,
        Failed = -1,
		Cancelled = -2
    }
}
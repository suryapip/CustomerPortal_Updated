using System;

namespace ScentAir.Payment.Models
{
    [Flags]
    public enum InvoiceStatus : int
    {
        Cancelled = -1,
        Any = 0,

        NotPaid    = 1,
        PaidInPart = 2,
        PaidInFull = 4,

        Due = 64,
        Overdue = 128,
        PaymentPending = 256,
    }
}
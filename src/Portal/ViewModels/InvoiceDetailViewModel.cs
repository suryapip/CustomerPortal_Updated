using System;
using System.Linq;

namespace ScentAir.Payment.ViewModels
{
    public class InvoiceDetailViewModel
    {
        public string Item { get; set; }
        public string Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public int Quantity { get; set; }
        public decimal Amount { get; set; }
    }
}

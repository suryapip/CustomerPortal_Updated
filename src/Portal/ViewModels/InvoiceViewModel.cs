using System;
using System.Collections.Generic;
using System.Linq;


namespace ScentAir.Payment.ViewModels
{
    public class InvoiceViewModel
    {
        public virtual CompanyViewModel BillingEntity { get; set; }

        public virtual AddressViewModel ShippingAddress { get; set; }
        public string ShippingNumber { get; set; }
        public string ShippingMethod { get; set; }
        public string ShippingResult { get; set; }


        public string TaxId { get; set; }


        public string InvoiceNumber { get; set; }

        public string CustomerReferenceNumber { get; set; }
        public string CustomerPurchaseOrderNumber { get; set; }

        public string Status { get; set; }
        public string IncoTerms { get; set; }
        public string Comments { get; set; }
        public string PaymentTerms { get; set; }
        public string Currency { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal SubTotalAmount { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }

        public decimal TotalAmountPaid { get; set; }

        public DateTimeOffset? ServiceFrom { get; set; }
        public DateTimeOffset? ServiceTo { get; set; }
        public DateTimeOffset Date { get; set; }
        public DateTimeOffset? DateDue { get; set; }

     
        public decimal Balance { get; set; }
        public string BalanceCurrency { get; set; }

     


        public ICollection<InvoiceDetailViewModel> Details { get; set; }
        public ICollection<InvoicePaymentViewModel> Payments { get; set; }
    }
}

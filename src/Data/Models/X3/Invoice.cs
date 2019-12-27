using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScentAir.Payment.Models.X3
{
    [Table("INVOICE_HEADER_PHASE2")]
    public partial class Invoice
    {
        public Invoice()
        {
            InvoiceDetails = new HashSet<InvoiceDetail>();
        }

        [StringLength(2)]
        [Column("LOGO")]
        public string Logo { get; set; }

        [StringLength(11)]
        public string DocType { get; set; }

        [Column("COMPNAME")]
        [StringLength(60)]
        public string CompanyName { get; set; }
        [Column("ADD1")]
        [StringLength(50)]
        public string Address1 { get; set; }
        [Column("ADD2")]
        [StringLength(50)]
        public string Address2 { get; set; }
        [Column("ADD3")]
        [StringLength(50)]
        public string Address3 { get; set; }
        [Column("CITY")]
        [StringLength(40)]
        public string City { get; set; }
        [Column("STATE")]
        [StringLength(35)]
        public string State { get; set; }
        [Column("POSTAL")]
        [StringLength(10)]
        public string PostalCode { get; set; }
        [Column("COUNTRY")]
        [StringLength(40)]
        public string Country { get; set; }

        [Column("PHONE")]
        [StringLength(84)]
        public string Phone { get; set; }
        [Column("FAX")]
        [StringLength(84)]
        public string Fax { get; set; }
        [Column("EMAIL")]
        [StringLength(30)]
        public string Email { get; set; }

        [Column("TAXIDPREFIX")]
        [StringLength(25)]
        public string TaxIdPrefix { get; set; }

        [Required]
        [Column("TAXID")]
        [StringLength(400)]
        public string TaxID { get; set; }

        [Key]
        [Column("NUMBER")]
        [StringLength(20)]
        public string Number { get; set; }
        [Column("DATE", TypeName = "datetime2(3)")]
        public DateTime Date { get; set; }

        [Required]
        [Column("CURRENCY")]
        [StringLength(3)]
        public string Currency { get; set; }

        [Required]
        [Column("BILLTOCUST")]
        [StringLength(15)]
        public string BillToCustomer { get; set; }
        public virtual Customer BillTo { get; set; }

        [Required]
        [Column("SOLDTOCUST")]
        [StringLength(15)]
        public string SoldToCustomer { get; set; }
        public virtual Customer SoldTo { get; set; }


        [Required]
        [Column("CUSTREF")]
        [StringLength(40)]
        public string CustomerReferenceNumber { get; set; }

        [Column("INVSTARTDATE", TypeName = "datetime2(3)")]
        public DateTime StartDate { get; set; }

        [NotMapped]
        [Column("DETSTARTDATE", TypeName = "datetime2(3)")]
        public DateTime? DetStartDate { get; set; }
        [Column("DETENDDATE", TypeName = "datetime2(3)")]
        public DateTime? DetEndDate { get; set; }

        [Column("BILLTONAME")]
        [StringLength(35)]
        public string BillToName { get; set; }
        [Column("BILLTOADD1")]
        [StringLength(50)]
        public string BillToAddress1 { get; set; }
        [Column("BILLTOADD2")]
        [StringLength(50)]
        public string BillToAddress2 { get; set; }
        [Column("BILLTOADD3")]
        [StringLength(50)]
        public string BillToAddress3 { get; set; }
        [Column("BILLTOCITY")]
        [StringLength(40)]
        public string BillToCity { get; set; }
        [Column("BILLTOSTATE")]
        [StringLength(35)]
        public string BillToState { get; set; }
        [Column("BILLTOPOSTAL")]
        [StringLength(10)]
        public string BillToPostalCode { get; set; }
        [Column("BILLTOCOUNTRY")]
        [StringLength(40)]
        public string BillToCountry { get; set; }

        [Required]
        [Column("SHIPTONAME")]
        [StringLength(60)]
        public string ShipToName { get; set; }
        [Required]
        [Column("SHIPTOADD1")]
        [StringLength(50)]
        public string ShipToAddress1 { get; set; }
        [Required]
        [Column("SHIPTOADD2")]
        [StringLength(50)]
        public string ShipToAddress2 { get; set; }
        [Required]
        [Column("SHIPTOADD3")]
        [StringLength(50)]
        public string ShipToAddress3 { get; set; }
        [Required]
        [Column("SHIPTOCITY")]
        [StringLength(40)]
        public string ShipToCity { get; set; }
        [Required]
        [Column("SHIPTOSTATE")]
        [StringLength(35)]
        public string ShipToState { get; set; }
        [Required]
        [Column("SHIPTOPOSTAL")]
        [StringLength(10)]
        public string ShipToPostal { get; set; }
        [Required]
        [Column("SHIPTOCOUNTRY")]
        [StringLength(40)]
        public string ShipToCountry { get; set; }

        [Column("SHIPVIA")]
        [StringLength(60)]
        public string ShipVia { get; set; }


        [Column("MEMO", TypeName = "ntext")]
        public string Memo { get; set; }


        [Column("CUSTPO")]
        [StringLength(30)]
        public string CustomerPO { get; set; }

        [Column("INCOTERMS")]
        [StringLength(80)]
        public string Incoterms { get; set; }
        [Column("PAYTERMS")]
        [StringLength(80)]
        public string Payterms { get; set; }

        [Column("DUEDATE", TypeName = "datetime2(3)")]
        public DateTime? DateDue { get; set; }


        [Column("PDCRAMT")]
        [StringLength(18)]
        public string PDCRAmount { get; set; }

        [Column("PAYREF")]
        public string PayRef { get; set; }

        [Column("CHECKNUM")]
        public string CheckNumber { get; set; }

        [Column("PAYAMT", TypeName = "decimal(38, 13)")]
        public double? PayAmount { get; set; }

        [Required]
        [Column("REMITCUR")]
        [StringLength(3)]
        public string RemitCurrency { get; set; }
        [Column("REMITNAME")]
        [StringLength(60)]
        public string RemitName { get; set; }
        [Column("REMITADD1")]
        [StringLength(50)]
        public string RemitAddress1 { get; set; }
        [Column("REMITADD2")]
        [StringLength(50)]
        public string RemitAddress2 { get; set; }
        [Column("REMITADD3")]
        [StringLength(50)]
        public string RemitAddress3 { get; set; }
        [Column("REMITCITY")]
        [StringLength(40)]
        public string RemitCity { get; set; }
        [Column("REMITSTATE")]
        [StringLength(35)]
        public string RemitState { get; set; }
        [Column("REMITPOSTAL")]
        [StringLength(10)]
        public string RemitPostalCode { get; set; }
        [Column("REMITCOUNTRY")]
        [StringLength(40)]
        public string RemitCountry { get; set; }


        [Column("WIRENAME")]
        [StringLength(60)]
        public string WireName { get; set; }
        [Column("WIREBANK")]
        [StringLength(60)]
        public string WireBank { get; set; }
        [Column("WIREBRANCH")]
        [StringLength(60)]
        public string WireBranch { get; set; }
        [Column("WIREBANKID")]
        [StringLength(60)]
        public string WireBankId { get; set; }

        [Column("WIREACCT")]
        [StringLength(40)]
        public string WireAccountNumber { get; set; }
        [Column("WIREROUTING")]
        [StringLength(30)]
        public string WireRoutingNumber { get; set; }

        [Column("SWIFT")]
        [StringLength(18)]
        public string Swift { get; set; }

        [Column("WIRECUR")]
        [StringLength(450)]
        public string WireCurrency { get; set; }

        [Column("SUBTOTAL", TypeName = "decimal(38, 8)")]
        public decimal? Subtotal { get; set; }

        [Column("PAIDAMT", TypeName = "decimal(38, 11)")]
        public decimal? PaidAmount { get; set; }

        [Required]
        [Column("BALCUR")]
        [StringLength(3)]
        public string BalanceCurrency { get; set; }

        [Column("IMPORTETOTAL")]
        [StringLength(200)]
        public string ImportETotal { get; set; }

        [Column("BALANCE", TypeName = "decimal(38, 13)")]
        public decimal? Balance { get; set; }


        [Column("SWIFTNAME")]
        [StringLength(7)]
        public string SwiftName { get; set; }

        [Column("REMITIBAN")]
        [StringLength(450)]
        public string RemitIBanNumber { get; set; }

        [Column("REMITSORTCODE")]
        [StringLength(450)]
        public string RemitSortCode { get; set; }

        [Column("WIRECLEARING")]
        [StringLength(450)]
        public string WireClearing { get; set; }

        [Column("CUSTTAXPREFIX")]
        [StringLength(20)]
        public string CustomerTaxPrefix { get; set; }

        [Column("CUSTTAXID")]
        [StringLength(20)]
        public string CustomerTaxId { get; set; }

        [Column("TEXTE_0")]
        public string TextE_0 { get; set; }

        [Column("WIRENAME2")]
        [StringLength(450)]
        public string WireName2 { get; set; }

        [Column("WIREBANK2")]
        [StringLength(450)]
        public string WireBankName2 { get; set; }

        [Column("WIREACCT2")]
        [StringLength(30)]
        public string WireAccount2 { get; set; }


        [Column("SWIFT2")]
        [StringLength(20)]
        public string Swift2 { get; set; }


        [Column("WIRECUR2")]
        [StringLength(450)]
        public string WireCurrency2 { get; set; }


        [Column("KVKNUMBER")]
        [StringLength(20)]
        public string KvkNumber { get; set; }

        [Column("CREDAT_0", TypeName = "datetime2(3)")]
        public DateTime CreditDate_0 { get; set; }

        [Column("UPDDAT_0", TypeName = "datetime2(3)")]
        public DateTime UpdatedDate_0 { get; set; }


        [Column("PAYBYCUST")]
        [StringLength(15)]
        public string PayByCustomer { get; set; }


        [Column("PAYBYNAME")]
        [StringLength(35)]
        public string PayByCustomerName  { get; set; }

        [Column("PAYBYADD1")]
        [StringLength(50)]
        public string PayByCustomerAdd1 { get; set; }


        [Column("PAYBYADD2")]
        [StringLength(50)]
        public string PayByCustomerAdd2 { get; set; }

        [Column("PAYBYADD3")]
        [StringLength(50)]
        public string PayByCustomerAdd3 { get; set; }

        [Column("PAYBYZIP")]
        [StringLength(10)]
        public string PayByCustomerZip { get; set; }

        [Column("PAYBYCTYSTATE")]
        [StringLength(77)]
        public string PayByCustomerCityState { get; set; }

        [NotMapped]
        [Column("TAXRATE", TypeName = "decimal(16, 7)")]
        public decimal? TaxRate { get; set; }
        [NotMapped]
        [Column("TAXAMT", TypeName = "decimal(27, 13)")]
        public decimal? TaxAmount { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }


        [Column("DateAdded", TypeName = "datetime2(3)")]
        public DateTime DateAdded { get; set; }

        
        [Column("CPY")]
        [StringLength(10)]
        public string Cpy { get; set; }

        //[ForeignKey("Soldtocust")]
        //[InverseProperty("Invoice")]

        //[InverseProperty("Invoice")]
        public virtual ICollection<InvoiceDetail> InvoiceDetails { get; set; }
        public virtual ICollection<InvoiceTax> InvoiceTaxes { get; set; }
    }
}

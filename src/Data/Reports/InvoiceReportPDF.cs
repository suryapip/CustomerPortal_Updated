using PdfSharp;
using PdfSharp.Drawing;
using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;

namespace ScentAir.Payment.Reports
{

    public class InvoiceReportPDF : BaseReportPDF<Invoice>
    {
        private readonly XStringFormat AlignRight;
        private readonly XStringFormat AlignCenter;
        private readonly XFont normal;
        private readonly XFont bold;
        private readonly XBrush brush;
        private CompanyWireAchDetail _companyWireAchDetail { get; set; }
        private InvoiceHeaderExtension _invoiceHeaderExtension { get; set; }
        private InvoiceTranslate _invoiceTranslate { get; set; }
        private NumberFormatInfo currencyNumberFormat { get; set; }

        private readonly string[] CPYCountriesOptionA = new string[] { "BUS", "BRI", "MAC", "BHK", "HKG", "MEX", "AUS", "BGB", "BMC", "CHI", "USA", "BACN" };

        private readonly string[] CPYCountriesOptionB = new string[] { "SPA", "NLD", "FRA", "SUI" };


        public InvoiceReportPDF() : base("Invoice")
        {
            AlignRight = new XStringFormat();
            AlignCenter = new XStringFormat();


            AlignRight.Alignment = XStringAlignment.Far;
            AlignRight.Alignment = XStringAlignment.Center;

            this.normal = base.defaultFont;
            this.bold = new XFont(this.normal.FontFamily.Name, this.normal.Size, XFontStyle.Bold);
            this.brush = base.defaultBrush;
        }

        public Guid CreatePDF(Invoice model, CompanyWireAchDetail companyWireAchDetail, InvoiceHeaderExtension invoiceHeaderExtension, InvoiceTranslate invoiceTranslate)
        {
            _companyWireAchDetail = companyWireAchDetail;
            _invoiceHeaderExtension = invoiceHeaderExtension;
            _invoiceTranslate = invoiceTranslate;

            switch (model.BilledToAccount.Language)
            {
                case "ENG":
                    currencyNumberFormat = new CultureInfo("en-US", false).NumberFormat;
                    break;
                case "FRA":
                    currencyNumberFormat = new CultureInfo("fr-FR", false).NumberFormat;
                    break;
                case "SPA":
                    currencyNumberFormat = new CultureInfo("es-ES", false).NumberFormat;
                    break;
                case "DUT":
                    currencyNumberFormat = new CultureInfo("nl-NL", false).NumberFormat;
                    break;
                default:
                    currencyNumberFormat = new CultureInfo("en-US", false).NumberFormat;
                    break;
            }
            currencyNumberFormat.CurrencySymbol = string.Empty;
            return CreateReport(model);
        }

        protected override Guid CreateReport(Invoice model)
        {
            // get data
            DateTime BeginDate = DateTime.Now;
            int topRowPosOfItems = 0;


            WriteHeader(model);
            topRowPosOfItems = rowpos;
            WriteItemHeader(model.BilledToAccount.Language);

            if (model.Details != null)
            {
                foreach (InvoiceDetail item in model.Details)
                {
                    WriteItem(item, model.BilledToAccount.Language);
                }

                if (model.Details.Count > 0)
                    WriteItemNew();
            }



            DrawItemLines(topRowPosOfItems, rowpos, model.BilledToAccount.Language);
            WriteTotals(model);

            return SavePDF();
        }

        private void drawString(string text, XFont font, XBrush brush, double x, double y)
        {
            drawString(text, x, y, font, brush);
        }
        private void drawString(string text, double x, double y, XFont font = null, XBrush brush = null)
        {
            drawString(text, new XPoint(x, y), font, brush);
        }
        private void drawString(string text, XPoint point, XFont font = null, XBrush brush = null)
        {
            drawString(text, font, brush, point);
        }
        private void drawString(string text, XFont font, XBrush brush, XPoint point)
        {
            brush = brush ?? this.brush;
            font = font ?? this.normal;
            text = text ?? "";

            var stringwidth = GetStringWidth(text, font);
            gfx.DrawString(text, font, brush, point);
        }

        private void WriteHeader(Invoice invoice)
        {
            int colWidth;
            double stringwidth;
            var t = rowpos;


            var seller = invoice.SellingEntity;
            var address = invoice.SellingEntity?.PhysicalAddress;

            var imagePath = _invoiceHeaderExtension.Logo == "SA"
                          ? Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "images/scentairinvoicelogo.jpg")
                          : Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "images/brandaroma.jpg");
            var xImage = XImage.FromFile(imagePath);


            gfx.DrawImage(xImage, leftMargin, topMargin, xImage.PixelWidth / 4, xImage.PixelHeight / 4);


            // left side
            rowpos += (LineHeight * 3);
            colpos = 0;
            if (!string.IsNullOrWhiteSpace(seller?.Name))
            {
                drawString(seller.Name, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(address?.Line1))
            {
                drawString(address?.Line1, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }
            if (!string.IsNullOrWhiteSpace(address?.Line2))
            {
                drawString(address?.Line2, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(address?.Line3))
            {
                drawString(address?.Line3, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            //CR : Address Layout
            var companyAddressLine = GetCityStatePostalString(address?.Municipality, address?.StateOrProvince, address?.PostalCode);

            if (!string.IsNullOrEmpty(companyAddressLine))
            {
                drawString($"{companyAddressLine}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(address?.Country))
            {
                drawString(address?.Country, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(seller?.PhoneNumber))
            {
                drawString($"{_invoiceTranslate.TelephoneNumber} {":"} {seller.PhoneNumber}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }
            if (!string.IsNullOrWhiteSpace(seller?.FaxNumber))
            {
                drawString($"{_invoiceTranslate.FaxNumber} {":"}  {seller.FaxNumber}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }
            if (!string.IsNullOrWhiteSpace(seller?.Email))
            {
                drawString($"{_invoiceTranslate.EmailId} {":"}  {seller.Email}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }


            if (!string.IsNullOrWhiteSpace(seller?.TaxIdPrefix) || !string.IsNullOrWhiteSpace(seller?.TaxId))
            {
                drawString($"{seller.TaxIdPrefix}{seller.TaxId}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }
            if (!string.IsNullOrWhiteSpace(seller?.KvkNumber))
            {
                drawString($"{seller.KvkNumber}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            // right side
            rowpos = t;
            colpos = 500;
            switch (_invoiceHeaderExtension.DocType)
            {
                case "Invoice":
                    stringwidth = GetStringWidth(_invoiceTranslate.Invoice, Times20);
                    drawString(_invoiceTranslate.Invoice.ToUpper(), pageWidth - (rightMargin + 1) - stringwidth, rowpos, Times20);
                    break;
                case "Proforma":
                    stringwidth = GetStringWidth(_invoiceTranslate.Proforma, Times20);
                    drawString(_invoiceTranslate.Proforma.ToUpper(), pageWidth - (rightMargin + 1) - stringwidth, rowpos, Times20);
                    break;
                case "Credit Memo":
                    stringwidth = GetStringWidth(_invoiceTranslate.Creditmemo, Times20);
                    drawString(_invoiceTranslate.Creditmemo.ToUpper(), pageWidth - (rightMargin + 1) - stringwidth, rowpos, Times20);
                    break;
                default:
                    stringwidth = GetStringWidth(_invoiceHeaderExtension.DocType, Times20);
                    drawString(_invoiceHeaderExtension.DocType.ToUpper(), pageWidth - (rightMargin + 1) - stringwidth, rowpos, Times20);
                    break;

            }


            colpos = 367;
            rowpos += LineHeight;
            drawString($"{_invoiceTranslate.Page} {":"}", new XPoint(leftMargin + colpos, rowpos), normal);

            string x = $"{_invoiceTranslate.Page} {pageNumber} {_invoiceTranslate.OfText} {pageNumber}";
            stringwidth = GetStringWidth(x, normal);
            drawString(x, pageWidth - rightMargin - stringwidth, rowpos);


            rowpos += LineHeight;


            drawString($"{_invoiceTranslate.Number}{":"}", new XPoint(leftMargin + colpos, rowpos));
            if (!string.IsNullOrEmpty(invoice.InvoiceNumber))
            {
                stringwidth = GetStringWidth(invoice.InvoiceNumber, normal);
                drawString(invoice.InvoiceNumber, pageWidth - rightMargin - stringwidth, rowpos);
            }
            rowpos += LineHeight;

            drawString($"{_invoiceTranslate.Date}{":"}", new XPoint(leftMargin + colpos, rowpos));
            stringwidth = GetStringWidth(invoice.InvoiceDate.ToString("dd-MMM-yyyy"), normal);
            drawString(invoice.InvoiceDate.ToString("dd-MMM-yyyy"), pageWidth - rightMargin - stringwidth, rowpos);
            rowpos += LineHeight;
            drawString($"{_invoiceTranslate.Currency}{":"}", new XPoint(leftMargin + colpos, rowpos));
            if (!string.IsNullOrEmpty(invoice.Currency))
            {
                stringwidth = GetStringWidth(invoice.Currency, normal);
                drawString(invoice.Currency, pageWidth - rightMargin - stringwidth, rowpos);
            }
            rowpos += LineHeight;
            drawString($"{_invoiceTranslate.BillToCustomer}{":"}", new XPoint(leftMargin + colpos, rowpos));
            if (!string.IsNullOrEmpty(invoice.BilledToAccountNumber))
            {
                stringwidth = GetStringWidth(invoice.BilledToAccountNumber, normal);
                drawString(invoice.BilledToAccountNumber, pageWidth - rightMargin - stringwidth, rowpos);
            }
            rowpos += LineHeight;
            drawString($"{_invoiceTranslate.SoldToCustomer}{":"}", new XPoint(leftMargin + colpos, rowpos));
            if (!string.IsNullOrEmpty(invoice.SoldToAccountNumber))
            {
                stringwidth = GetStringWidth(invoice.SoldToAccountNumber, normal);
                drawString(invoice.SoldToAccountNumber, pageWidth - rightMargin - stringwidth, rowpos);
            }
            rowpos += LineHeight;
            drawString($"{_invoiceTranslate.CustomerRef}{":"}", new XPoint(leftMargin + colpos, rowpos));
            if (!string.IsNullOrEmpty(invoice.CustomerReferenceNumber))
            {
                stringwidth = GetStringWidth(invoice.CustomerReferenceNumber, normal);
                drawString(invoice.CustomerReferenceNumber, pageWidth - rightMargin - stringwidth, rowpos);
            }
            rowpos += LineHeight;
            drawString($"{_invoiceTranslate.ServicePeriod}{":"}", new XPoint(leftMargin + colpos, rowpos));

            if (invoice?.ServiceFrom != null && invoice?.ServiceTo != null)
            {
                stringwidth = GetStringWidth(String.Concat(invoice?.ServiceFrom.Value.Date.ToString("dd-MMM-yyyy"), _invoiceTranslate.ToText, invoice?.ServiceTo.Value.Date.ToString("dd-MMM-yyyy")), normal);
                drawString(String.Concat(invoice?.ServiceFrom.Value.Date.ToString("dd-MMM-yyyy"), " ", _invoiceTranslate.ToText, " ", invoice?.ServiceTo.Value.Date.ToString("dd-MMM-yyyy")), pageWidth - rightMargin - stringwidth, rowpos);
            }

            rowpos += (LineHeight * 3);


            // ship-to & bill-to heading
            rect = new XRect(new XPoint(20, rowpos - 20), new XPoint(pageWidth - 20, rowpos));
            gfx.DrawRectangle(XPens.LightGray, LightGrayBrush, rect);
            colpos = 75;
            drawString(_invoiceTranslate.Billto, new XPoint(leftMargin + colpos, rowpos - 6));
            colpos = 300;
            drawString(_invoiceTranslate.Shipto, new XPoint(leftMargin + colpos, rowpos - 6));

            DrawLine(rowpos - 20);
            DrawLine(rowpos);
            DrawLine(leftMargin, rowpos - 20, leftMargin, rowpos);
            DrawLine(pageWidth - rightMargin, rowpos - 20, pageWidth - rightMargin, rowpos);

            rowpos += LineHeight;

            t = rowpos;

            var billedTo = invoice.BilledToAccount ?? invoice.SoldToAccount;
            var billedToAddr = billedTo.BillingAddress ?? billedTo.MailingAddress ?? billedTo.PhysicalAddress;

            // bill To
            rowpos = t;
            colpos = 75;
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension?.BillToName))
            {
                drawString(_invoiceHeaderExtension?.BillToName, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.BillToAddress?.Line1))
            {
                drawString(_invoiceHeaderExtension.BillToAddress?.Line1, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.BillToAddress?.Line2))
            {
                drawString(_invoiceHeaderExtension.BillToAddress?.Line2, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.BillToAddress?.Line3))
            {
                drawString(_invoiceHeaderExtension.BillToAddress?.Line3, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }


            //CR : Address Layout
            var billedAddressLine = GetCityStatePostalString(_invoiceHeaderExtension.BillToAddress?.Municipality, _invoiceHeaderExtension.BillToAddress?.StateOrProvince, _invoiceHeaderExtension.BillToAddress?.PostalCode);

            if (!string.IsNullOrEmpty(billedAddressLine))
            {
                drawString($"{billedAddressLine}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }


            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.BillToAddress?.Country))
            {
                drawString(billedToAddr?.Country, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }


            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.Memo))
            {
                rowpos += LineHeightSmall;
                drawString(_invoiceHeaderExtension.Memo, new XPoint(leftMargin + colpos, rowpos));
            }

            var soldTo = invoice.SoldToAccount ?? invoice.BilledToAccount;
            var soldToAddr = soldTo.ShippingAddress ?? soldTo.MailingAddress ?? soldTo.PhysicalAddress;

            // ship to
            colpos = 300;
            rowpos = t;
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension?.ShipToName))
            {
                drawString(_invoiceHeaderExtension?.ShipToName, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.ShipToAddress?.Line1))
            {
                drawString(_invoiceHeaderExtension.ShipToAddress?.Line1, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.ShipToAddress?.Line2))
            {
                drawString(_invoiceHeaderExtension.ShipToAddress?.Line2, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.ShipToAddress?.Line3))
            {
                drawString(_invoiceHeaderExtension.ShipToAddress?.Line3, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            //CR : Address Layout
            var shipAddressLine = GetCityStatePostalString(_invoiceHeaderExtension.ShipToAddress?.Municipality, _invoiceHeaderExtension.ShipToAddress?.StateOrProvince, _invoiceHeaderExtension.ShipToAddress?.PostalCode);

            if (!string.IsNullOrEmpty(shipAddressLine))
            {
                drawString($"{shipAddressLine}", new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.ShipToAddress?.Country))
            {
                drawString(_invoiceHeaderExtension.ShipToAddress?.Country, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }
            rowpos += LineHeightSmall - 10;
            //**Added by PIP**
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension?.CustTaxPrefix) || !string.IsNullOrWhiteSpace(_invoiceHeaderExtension?.CustTaxId))
            {
                drawString(_invoiceHeaderExtension?.CustTaxPrefix + "" + _invoiceHeaderExtension?.CustTaxId, new XPoint(leftMargin + colpos, rowpos));
                rowpos += LineHeightSmall;
            }

            //**Added by PIP**

            rowpos += LineHeight;

            // misc fields headings
            var MiscFieldsRowPos = rowpos;
            rect = new XRect(new XPoint(20, rowpos - 20), new XPoint(page.Width - 20, rowpos));
            gfx.DrawRectangle(XPens.LightGray, LightGrayBrush, rect);

            if (invoice.BilledToAccount.Language == "FRA")
            {
                colpos = 2;
            }
            else
            {
                colpos = 40;
            }

            drawString(_invoiceTranslate.CustomerPO, new XPoint(leftMargin + colpos, rowpos - 6));

            if (invoice.BilledToAccount.Language == "FRA" || invoice.BilledToAccount.Language == "SPA")
            {
                colpos = 160;
            }
            else
            {
                colpos = 180;
            }

            drawString(_invoiceTranslate.Shipvia, new XPoint(leftMargin + colpos, rowpos - 6));
            colpos = 315;
            drawString(_invoiceTranslate.Incoterms, new XPoint(leftMargin + colpos, rowpos - 6));

            if (invoice.BilledToAccount.Language == "FRA" || invoice.BilledToAccount.Language == "SPA")
            {
                colpos = 410;
            }
            else
            {
                colpos = 450;
            }
            drawString(_invoiceTranslate.Paymentterms, new XPoint(leftMargin + colpos, rowpos - 6));

            DrawLine(rowpos - 20);
            DrawLine(rowpos);
            DrawLine(leftMargin, rowpos - 20, leftMargin, rowpos);
            DrawLine(pageWidth - rightMargin, rowpos - 20, pageWidth - rightMargin, rowpos);

            rowpos += LineHeightSmall;

            // misc fields data
            colpos = 5;
            if (!string.IsNullOrEmpty(invoice.CustomerPurchaseOrderNumber))
            {
                colWidth = 125;
                stringwidth = GetStringWidth(invoice.CustomerPurchaseOrderNumber, normal);
                if (stringwidth > 0)
                {
                    stringwidth = (colWidth - stringwidth) / 2;
                }
                drawString(invoice.CustomerPurchaseOrderNumber, new XPoint(leftMargin + colpos + stringwidth, rowpos + 5));
            }
            colpos = 135;
            if (!string.IsNullOrEmpty(invoice.ShippingMethod))
            {
                colWidth = 125;
                stringwidth = GetStringWidth(invoice.ShippingMethod, normal);
                if (stringwidth > 0)
                {
                    stringwidth = (colWidth - stringwidth) / 2;
                }
                drawString(invoice.ShippingMethod, new XPoint(leftMargin + colpos + stringwidth, rowpos + 5));
            }
            colpos = 275;
            if (!string.IsNullOrEmpty(invoice.IncoTerms))
            {
                colWidth = 125;
                stringwidth = GetStringWidth(invoice.IncoTerms, normal);
                if (stringwidth > 0)
                {
                    stringwidth = (colWidth - stringwidth) / 2;
                }
                drawString(invoice.IncoTerms, new XPoint(leftMargin + colpos + stringwidth, rowpos + 5));
            }
            colpos = 400;
            if (!string.IsNullOrEmpty(invoice.PaymentTerms))
            {
                colWidth = (int)(pageWidth - 400 - rightMargin - leftMargin);
                stringwidth = GetStringWidth(invoice.PaymentTerms, normal);
                if (stringwidth > 0)
                {
                    stringwidth = (colWidth - stringwidth) / 2;
                }
                drawString(invoice.PaymentTerms, new XPoint(leftMargin + colpos + stringwidth, rowpos));

                var dueon = $"{_invoiceTranslate.Dueon} {":"} {invoice.DateDue?.ToString("dd-MMM-yyyy")}";
                stringwidth = GetStringWidth(dueon, normal);
                if (stringwidth > 0)
                {
                    stringwidth = (colWidth - stringwidth) / 2;
                }
                drawString(dueon, new XPoint(leftMargin + colpos + stringwidth, rowpos + 10));
            }

            rowpos += LineHeight;

            // draw header lines  
            DrawLine(leftMargin, MiscFieldsRowPos - 20, leftMargin, rowpos);
            DrawLine(leftMargin + 135, MiscFieldsRowPos - 20, leftMargin + 135, rowpos);
            DrawLine(leftMargin + 275, MiscFieldsRowPos - 20, leftMargin + 275, rowpos);
            DrawLine(leftMargin + 400, MiscFieldsRowPos - 20, leftMargin + 400, rowpos);
            DrawLine(pageWidth - rightMargin, MiscFieldsRowPos - 20, pageWidth - rightMargin, rowpos);
            DrawLine(rowpos);

            rowpos += LineHeight;
            rowpos += LineHeight;
        }

        private void WriteItemHeader(string language)
        {

            rect = new XRect(new XPoint(20, rowpos - 20), new XPoint(page.Width - 20, rowpos));
            gfx.DrawRectangle(XPens.LightGray, LightGrayBrush, rect);


            if (language == "FRA" || language == "SPA")
            {
                colpos = 10;
            }
            else
            {
                colpos = 50;

            }

            drawString(_invoiceTranslate.Item, new XPoint(leftMargin + colpos, rowpos - 6));
            colpos = 215;
            drawString(_invoiceTranslate.Description, new XPoint(leftMargin + colpos, rowpos - 6));
            colpos = 355;//changed by pip team (365)
            drawString(_invoiceTranslate.Quantity, new XPoint(leftMargin + colpos, rowpos - 6));
            colpos = 420;//changed by pip team (450)
            if (language == "DUT" || language == "ENG")
            {
                colpos = 450;
                drawString(_invoiceTranslate.Price, new XPoint(leftMargin + colpos, rowpos - 6));
            }
            else
            {
                drawString(_invoiceTranslate.Price + "       " + _invoiceTranslate.TVAVAT, new XPoint(leftMargin + colpos, rowpos - 6));
            }

            colpos = 530;
            drawString(_invoiceTranslate.Amount, new XPoint(leftMargin + colpos, rowpos - 6));

            DrawLine(rowpos - 20);
            DrawLine(rowpos);
            DrawLine(leftMargin, rowpos - 20, leftMargin, rowpos);
            DrawLine(pageWidth - rightMargin, rowpos - 20, pageWidth - rightMargin, rowpos);

            rowpos += LineHeight;
        }


        private void WriteItem(InvoiceDetail Item, string language)
        {
            double stringwidth;
            double colWidth;

            colpos = leftMargin + 5;
            drawString(Item.Item, new XPoint(colpos, rowpos));
            colpos = 155;
            drawString(Item.Description, new XPoint(colpos + 5, rowpos));

            colpos = 310;//changed by pip team (365)
            colWidth = 125;
            stringwidth = GetStringWidth(Item.Quantity.ToString("N0"), normal);
            if (stringwidth > 0)
            {
                stringwidth = (colWidth - stringwidth) / 2;
            }
            drawString(Item.Quantity.ToString("N0"), new XPoint(leftMargin + colpos + stringwidth, rowpos));

            if (language == "DUT" || language == "ENG")
            {
                stringwidth = GetStringWidth(Item.UnitPrice.ToString("C", currencyNumberFormat), normal);
                drawString(Item.UnitPrice.ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 100, rowpos));
            }
            else
            {
                colpos = 373;
                colWidth = 125;
                stringwidth = GetStringWidth(Item.UnitPrice.ToString("C", currencyNumberFormat), normal);
                if (stringwidth > 0)
                {
                    stringwidth = (colWidth - stringwidth) / 2;
                }
                drawString(Item.UnitPrice.ToString("C", currencyNumberFormat) + "       " + Item.LineTaxRate.ToString("C", currencyNumberFormat), new XPoint(leftMargin + colpos + stringwidth, rowpos));
            }

            stringwidth = GetStringWidth(Item.ExtraAmount.ToString("C", currencyNumberFormat), normal);
            drawString(Item.ExtraAmount.ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
            rowpos += LineHeight;

        }

        //** ADDED BY PIP TEAM **
        private void WriteItemNew()
        {
            double stringwidth;
            double colWidth;

            colpos = 155;
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PdcrAmount) && !string.IsNullOrWhiteSpace(_invoiceHeaderExtension.CheckNumber))
            {
                drawString($"{_invoiceHeaderExtension.PdcrAmount} {" "} {_invoiceHeaderExtension.CheckNumber}", new XPoint(colpos + 5, rowpos), bold);
                rowpos += LineHeight;
            }
            drawString($"{_invoiceHeaderExtension.PaymentReference}", new XPoint(colpos + 5, rowpos), bold);

            colpos = 510;
            colWidth = 125;
            stringwidth = GetStringWidth("ExtraA", normal);
            if (stringwidth > 0)
            {
                stringwidth = (colWidth - stringwidth) / 2;
            }
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayAmount.ToString()))
            {
                drawString($"{_invoiceHeaderExtension.PayAmount?.ToString("C", currencyNumberFormat)}", new XPoint(pageWidth - rightMargin - stringwidth, rowpos));

            }
            rowpos += LineHeight;
        }

        private void DrawItemLines(int TopPos, int BottomPos, string language)
        {
            // draw header lines           
            DrawLine(leftMargin, TopPos - 20, leftMargin, BottomPos);
            DrawLine(leftMargin + 135, TopPos - 20, leftMargin + 135, BottomPos);
            DrawLine(pageWidth - rightMargin - 225, TopPos - 20, pageWidth - rightMargin - 225, BottomPos);
            if (language == "DUT")
            {
                DrawLine(pageWidth - rightMargin - 150, TopPos - 20, pageWidth - rightMargin - 150, BottomPos);
            }
            else
            {
                DrawLine(pageWidth - rightMargin - 175, TopPos - 20, pageWidth - rightMargin - 175, BottomPos);
            }
            DrawLine(pageWidth - rightMargin - 65, TopPos - 20, pageWidth - rightMargin - 65, BottomPos); //Changed by PIP Team
            DrawLine(pageWidth - rightMargin, TopPos - 20, pageWidth - rightMargin, BottomPos);
            DrawLine(leftMargin, BottomPos, pageWidth - rightMargin, BottomPos);
        }


        private void WriteTotals(Invoice invoice)
        {
            rowpos += LineHeight;
            int TopPos = rowpos;
            double stringwidth;

            rowpos += 5;
            colpos = 350;

            drawString($"{_invoiceTranslate.SubTotal} {":"}", new XPoint(leftMargin + colpos + 2, rowpos));
            stringwidth = GetStringWidth(invoice.SubTotalAmount.ToString("C", currencyNumberFormat), normal);
            drawString(invoice.SubTotalAmount.ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
            rowpos += LineHeight;

            if (invoice.Taxes != null)
            {
                if (invoice.Taxes.Count > 0)
                {
                    foreach (var tax in invoice.Taxes)
                    {
                        drawString(tax.TaxDesc + ":", new XPoint(leftMargin + colpos + 2, rowpos));
                        stringwidth = GetStringWidth(tax.TaxAmount.ToString("C", currencyNumberFormat), normal);
                        drawString(tax.TaxAmount.ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
                        rowpos += LineHeight;
                    }
                }
                else
                {
                    drawString($"{_invoiceTranslate.Tax} {(invoice.TaxRate / 100).ToString("P2")}:", new XPoint(leftMargin + colpos + 2, rowpos));
                    stringwidth = GetStringWidth(invoice.TaxAmount.ToString("C", currencyNumberFormat), normal);
                    drawString(invoice.TaxAmount.ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
                    rowpos += LineHeight;
                }
            }
            else
            {
                drawString($"{_invoiceTranslate.Tax} {(invoice.TaxRate / 100).ToString("P2")}:", new XPoint(leftMargin + colpos + 2, rowpos));
                stringwidth = GetStringWidth(invoice.TaxAmount.ToString("C", currencyNumberFormat), normal);
                drawString(invoice.TaxAmount.ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
                rowpos += LineHeight;
            }


            drawString($"{_invoiceTranslate.MontantTTC} {":"}", new XPoint(leftMargin + colpos + 2, rowpos));

            decimal value;
            if (decimal.TryParse(_invoiceHeaderExtension.ImporteTOT, out value))
            {
                stringwidth = GetStringWidth(Convert.ToDecimal(_invoiceHeaderExtension.ImporteTOT).ToString("C", currencyNumberFormat), normal);
                drawString(Convert.ToDecimal(_invoiceHeaderExtension.ImporteTOT).ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
            }
            else
            {
                stringwidth = GetStringWidth(Convert.ToDecimal(0).ToString("C", currencyNumberFormat), normal);
                drawString(Convert.ToDecimal(0).ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
            }


            rowpos += LineHeight;
            rowpos += 5;


            drawString($"{_invoiceTranslate.PaidCreditAmount}{":"}", new XPoint(leftMargin + colpos + 2, rowpos));
            stringwidth = GetStringWidth((-1 * invoice.TotalAmountPaid).ToString("C", currencyNumberFormat), normal);
            drawString((-1 * invoice.TotalAmountPaid).ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos));
            rowpos += LineHeight;
            rowpos += 5;

            // draw balance due top line
            DrawLine(leftMargin + colpos, rowpos - LineHeight, pageWidth - rightMargin, rowpos - LineHeight);
            rect = new XRect(new XPoint(leftMargin + colpos, rowpos - LineHeight), new XPoint(leftMargin + colpos + 75, rowpos));
            gfx.DrawRectangle(XPens.Black, BlackBrush, rect);
            drawString($"{_invoiceTranslate.Balance}{":"}", normal, WhiteBrush, new XPoint(leftMargin + colpos + 5, rowpos - 7)); //Updated by PIP team

            drawString(invoice.Currency ?? string.Empty, new XPoint(colpos + 100, rowpos - 7)); //Updated by PIP team(110)
            stringwidth = GetStringWidth(invoice.Balance.ToString("C", currencyNumberFormat), normal);
            drawString(invoice.Balance.ToString("C", currencyNumberFormat), new XPoint(pageWidth - rightMargin - stringwidth - 5, rowpos - 7));

            // draw lines
            DrawLine(leftMargin + colpos, TopPos - 10, pageWidth - rightMargin, TopPos - 10);
            DrawLine(leftMargin + colpos, rowpos, pageWidth - rightMargin, rowpos);
            DrawLine(leftMargin + colpos, TopPos - 10, leftMargin + colpos, rowpos);
            DrawLine(pageWidth - rightMargin, TopPos - 10, pageWidth - rightMargin, rowpos);
            DrawLine(pageWidth - rightMargin - 100, TopPos - 10, pageWidth - rightMargin - 100, rowpos);

            rowpos += LineHeight;


            var remitAddress = _invoiceHeaderExtension?.RemitAddress;

            // remit to
            int temprowpos = TopPos;
            colpos = 0;
            int extendedColPos = 0;
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension?.RemitName) && !string.IsNullOrWhiteSpace(_invoiceHeaderExtension?.RemitCurrency))
            {
                drawString($"{_invoiceTranslate.RemitpaymentTo}:({_invoiceTranslate.Currency} {_invoiceHeaderExtension?.RemitCurrency})", new XPoint(leftMargin + colpos, temprowpos), bold);
                temprowpos += LineHeightSmall;

                if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension?.RemitName))
                {
                    drawString(_invoiceHeaderExtension?.RemitName, new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(remitAddress?.Line1))
                {

                    stringwidth = GetStringWidth(remitAddress?.Line1, normal);
                    if (stringwidth > 150)
                        extendedColPos = 195;
                    drawString($"{remitAddress?.Line1.Trim()}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(remitAddress?.Line2))
                {
                    stringwidth = GetStringWidth(remitAddress?.Line2, normal);
                    if (stringwidth > 150)
                        extendedColPos = 195;

                    drawString($"{remitAddress?.Line2.Trim()}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(remitAddress?.Line3))
                {
                    stringwidth = GetStringWidth(remitAddress?.Line3, normal);
                    if (stringwidth > 150)
                        extendedColPos = 195;

                    drawString($"{remitAddress?.Line3.Trim()}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(remitAddress?.Municipality) || !string.IsNullOrWhiteSpace(remitAddress?.StateOrProvince) || !string.IsNullOrWhiteSpace(remitAddress?.PostalCode))
                {

                    drawString($"{remitAddress?.Municipality}, {remitAddress?.StateOrProvince} {remitAddress?.PostalCode}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(remitAddress?.Country))
                {
                    drawString(remitAddress?.Country, new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }

            }

            colpos = 0;
            if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayByName))
            {
                if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayByCustomer))
                {
                    drawString($"{_invoiceHeaderExtension.PayByCustomer}", new XPoint(leftMargin + colpos, temprowpos), bold);
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayByName))
                {
                    drawString($"{_invoiceHeaderExtension.PayByName}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayByAddress?.Line1))
                {
                    drawString($"{_invoiceHeaderExtension.PayByAddress?.Line1}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayByAddress?.Line2))
                {
                    drawString($"{_invoiceHeaderExtension.PayByAddress?.Line2}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayByAddress?.Line3))
                {
                    drawString($"{_invoiceHeaderExtension.PayByAddress?.Line3}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_invoiceHeaderExtension.PayByAddress?.PostalCode))
                {
                    drawString($"{_invoiceHeaderExtension.PayByAddress?.PostalCode}{" "}{_invoiceHeaderExtension.PayByAddress?.StateOrProvince}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
            }


            // Wire/ACH
            temprowpos = TopPos;

            colpos = extendedColPos > 0 ? extendedColPos : 170;

            if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.WireName) || !string.IsNullOrWhiteSpace(_companyWireAchDetail?.RemitBan) || !string.IsNullOrWhiteSpace(_companyWireAchDetail?.SwiftName) || !string.IsNullOrWhiteSpace(_companyWireAchDetail?.Swift))
            {
                drawString($"{_invoiceTranslate.WireAchInformation}", new XPoint(leftMargin + colpos, temprowpos), bold);
                temprowpos += LineHeightSmall;

                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.WireName))
                {
                    drawString(_companyWireAchDetail?.WireName, new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.WireBank))
                {
                    drawString($"{_companyWireAchDetail?.WireBank}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.WireBranch))
                {
                    drawString($"{_companyWireAchDetail?.WireBranch} ", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.WireBankId))
                {
                    drawString($"{_companyWireAchDetail.WireBankId}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.WireAccountNumber))
                {
                    drawString($"{_companyWireAchDetail?.WireAccountNumber}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.WireRoutingNumber))
                {
                    drawString($"{_companyWireAchDetail?.WireRoutingNumber}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }

                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.WireClearing) || !string.IsNullOrWhiteSpace(_companyWireAchDetail.RemitSortcode))
                {
                    drawString($"{_companyWireAchDetail?.WireClearing}{_companyWireAchDetail.RemitSortcode} ", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }

                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.RemitBan))
                {
                    drawString($"{_companyWireAchDetail?.RemitBan}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }

                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.SwiftName) || !string.IsNullOrWhiteSpace(_companyWireAchDetail.Swift))
                {
                    drawString($"{_companyWireAchDetail?.SwiftName}{_companyWireAchDetail.Swift} ", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }


                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail?.WireCurrency))
                {
                    drawString($"{_companyWireAchDetail?.WireCurrency}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }


                temprowpos += LineHeightSmall;
                colpos = 170;

                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.WireName2))
                {
                    drawString($"{_companyWireAchDetail.WireName2}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.WireBank2))
                {
                    drawString($"{_companyWireAchDetail.WireBank2}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.WireAccount2))
                {
                    drawString($"{_companyWireAchDetail.WireAccount2}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.Swift2))
                {
                    drawString($"{_companyWireAchDetail.Swift2}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
                if (!string.IsNullOrWhiteSpace(_companyWireAchDetail.WireCurrency2))
                {
                    drawString($"{_companyWireAchDetail.WireCurrency2}", new XPoint(leftMargin + colpos, temprowpos));
                    temprowpos += LineHeightSmall;
                }
            }
            //**ADDED BY PIP TEAM**
        }


        private string GetCityStatePostalString(string Municipality, string StateOrProvince, string PostalCode)
        {
            int isCpyFoundOptionA = Array.IndexOf(CPYCountriesOptionA, _invoiceHeaderExtension.CPY);
            int isCpyFoundOptionB = Array.IndexOf(CPYCountriesOptionB, _invoiceHeaderExtension.CPY);


            if (isCpyFoundOptionA > -1)
            {
                if (!string.IsNullOrWhiteSpace(Municipality) ||
                !string.IsNullOrWhiteSpace(StateOrProvince) ||
                !string.IsNullOrWhiteSpace(PostalCode))
                {
                    return $"{Municipality} {StateOrProvince} { PostalCode}";

                }
            }
            else if (isCpyFoundOptionB > -1)
            {
                if (!string.IsNullOrWhiteSpace(Municipality) ||
                !string.IsNullOrWhiteSpace(StateOrProvince) ||
                !string.IsNullOrWhiteSpace(PostalCode))
                {
                    return $"{PostalCode} {Municipality} { StateOrProvince }";

                }
            }
            else
            {

                if (!string.IsNullOrWhiteSpace(Municipality) ||
                !string.IsNullOrWhiteSpace(StateOrProvince) ||
                !string.IsNullOrWhiteSpace(PostalCode))
                {
                    return $"{Municipality} {StateOrProvince} { PostalCode}";

                }
            }

            return string.Empty;
        }

    }
}

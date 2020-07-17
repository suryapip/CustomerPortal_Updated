using PdfSharp;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using System;
using System.Drawing;
using System.IO;
using System.Reflection;

namespace ScentAir.Payment.Reports
{
    public abstract class BaseReportPDF<T> where T : class
    {

        protected int pageNumber = 1;

        protected DateTime PrintDate = DateTime.Now;

        protected int leftMargin = 20;
        protected int rightMargin = 20;
        protected int topMargin = 20;
        protected int bottomMargin = 20;

        protected int rowpos;
        protected int colpos;
        protected int LineHeight = 20;
        protected int LineHeightSmall = 15;
        protected int LineHeightTight = 10;

        protected PdfDocument document = new PdfDocument();


        protected XRect rect;
        protected PdfPage page;
        protected XGraphics gfx;

        protected PageOrientation orientation;
        protected PageSize pageSize;

        protected XUnit pageLength;
        protected XUnit pageWidth;
        protected XFont defaultFont;
        protected XBrush defaultBrush;
        protected XPen BlackPen = new XPen(XColors.Black, 1);
        protected XPen RedPen = new XPen(XColors.Red, 1);
        protected XPen GreenPen = new XPen(XColors.Green, 1);
        protected XPen BluePen = new XPen(XColors.Blue, 1);
        protected XPen OrangePen = new XPen(XColors.Orange, 1);
        protected XPen Pink = new XPen(XColors.Pink, 1);
        protected XPen PurplePen = new XPen(XColors.Purple, 1);
        protected XPen WhitePen = new XPen(XColors.White, 1);
        protected XPen HeaderBorderPen = new XPen(XColors.White, 1);

        protected XBrush BlackBrush = new XSolidBrush(XColors.Black);
        protected XBrush RedBrush = new XSolidBrush(XColors.Red);
        protected XBrush BlueBrush = new XSolidBrush(XColors.Blue);
        protected XBrush GreenBrush = new XSolidBrush(XColors.Green);
        protected XBrush OrangeBrush = new XSolidBrush(XColors.Orange);
        protected XBrush PinkBrush = new XSolidBrush(XColors.Pink);
        protected XBrush PurpleBrush = new XSolidBrush(XColors.Purple);
        protected XBrush WhiteBrush = new XSolidBrush(XColors.White);
        protected XBrush GrayBrush = new XSolidBrush(XColors.Gray);
        protected XBrush LightGrayBrush = new XSolidBrush(XColors.LightGray);

        protected XFont LucidaSans_20 = new XFont("Lucida Sans", 20);
        protected XFont LucidaSans_14 = new XFont("Lucida Sans", 14);
        protected XFont LucidaSans_12 = new XFont("Lucida Sans", 12);
        protected XFont LucidaSans_10 = new XFont("Lucida Sans", 10);
        protected XFont LucidaSans_8 = new XFont("Lucida Sans", 8);
        protected XFont LucidaSans_6 = new XFont("Lucida Sans", 6);
        protected XFont LucidaSans_3 = new XFont("Lucida Sans", 3);

        protected XFont SegoeUI_20 = new XFont("Segoe UI", 20);
        protected XFont SegoeUI_14 = new XFont("Segoe UI", 14);
        protected XFont SegoeUI_12 = new XFont("Segoe UI", 12);
        protected XFont SegoeUI_10 = new XFont("Segoe UI", 10);
        protected XFont SegoeUI_8 = new XFont("Segoe UI", 8);
        protected XFont SegoeUI_6 = new XFont("Segoe UI", 6);
        protected XFont SegoeUI_3 = new XFont("Segoe UI", 3);

        protected XFont SegoeUI_20_Bold = new XFont("Segoe UI", 20, XFontStyle.Bold);
        protected XFont SegoeUI_14_Bold = new XFont("Segoe UI", 14, XFontStyle.Bold);
        protected XFont SegoeUI_12_Bold = new XFont("Segoe UI", 12, XFontStyle.Bold);
        protected XFont SegoeUI_10_Bold = new XFont("Segoe UI", 10, XFontStyle.Bold);
        protected XFont SegoeUI_8_Bold = new XFont("Segoe UI", 8, XFontStyle.Bold);
        protected XFont SegoeUI_6_Bold = new XFont("Segoe UI", 6, XFontStyle.Bold);
        protected XFont SegoeUI_3_Bold = new XFont("Segoe UI", 3, XFontStyle.Bold);

        protected XFont Times20 = new XFont("Times New Roman", 20);
        protected XFont Times14 = new XFont("Times New Roman", 14);
        protected XFont Times12 = new XFont("Times New Roman", 12);
        protected XFont Times10 = new XFont("Times New Roman", 10);
        protected XFont Times8 = new XFont("Times New Roman", 8);
        protected XFont Times6 = new XFont("Times New Roman", 6);
        protected XFont Times3 = new XFont("Times New Roman", 3);

        protected XFont Verdana_20 = new XFont("Verdana", 20);
        protected XFont Verdana_14 = new XFont("Verdana", 14);
        protected XFont Verdana_12 = new XFont("Verdana", 12);
        protected XFont Verdana_10 = new XFont("Verdana", 10);
        protected XFont Verdana_9 = new XFont("Verdana", 9);
        protected XFont Verdana_85 = new XFont("Verdana", 8.5);
        protected XFont Verdana_8 = new XFont("Verdana", 8);
        protected XFont Verdana_6 = new XFont("Verdana", 6);
        protected XFont Verdana_3 = new XFont("Verdana", 3);

        protected XFont ArialUnicodeMS_85 = new XFont("Arial Unicode MS", 8.5);


        protected string _ReportName;
        protected string _ReportAuthor = "ScentAir Technologies, LLC";

        protected BaseReportPDF(string ReportName, PageSize pageSize = PageSize.A4, PageOrientation orientation = PageOrientation.Portrait, int leftMargin = 20, int rightMargin = 20, int topMargin = 20, int bottomMargin = 20, XFont defaultFont = null, XBrush defaultBrush = null)
        {
            document = new PdfDocument();
            page = document.AddPage();
            gfx = XGraphics.FromPdfPage(page);


            pageLength = page.Height;
            pageWidth = page.Width;



            this.defaultFont = defaultFont ?? ArialUnicodeMS_85;
            this.defaultBrush = defaultBrush ?? BlackBrush;

            _ReportName = ReportName;


            this.pageSize = pageSize;
            this.orientation = orientation;

            this.topMargin = topMargin;
            this.bottomMargin = bottomMargin;
            this.leftMargin = leftMargin;
            this.rightMargin = rightMargin;

            rowpos = topMargin;

            document.Info.Title = _ReportName;
            document.Info.Author = _ReportAuthor;
            document.Info.Subject = _ReportName;


        }

        protected void SetReportName(string ReportName)
        {
            _ReportName = ReportName;
        }

        protected Guid SavePDF()
        {
            Guid id = Guid.NewGuid();
            string filename = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "ReportsPDF/" + id.ToString() + ".pdf");
            document.Save(filename);
            return id;
        }

        protected MemoryStream SaveToMemoryStream()
        {
            MemoryStream ms = new MemoryStream();
            document.Save(ms);
            return ms;
        }

        protected bool NextPage(int NeededRoom = 40)
        {
            bool rc = false;
            if (rowpos + NeededRoom + bottomMargin > pageLength.Value)
            {
                NewPage();
                rc = true;
            }
            return rc;
        }

        protected void NewPage()
        {
            page = document.AddPage();
            gfx = XGraphics.FromPdfPage(page);
            pageLength = page.Height;
            pageWidth = page.Width;

            rowpos = topMargin;
            pageNumber++;
        }

        protected void DrawLine(int rowpos)
        {
            gfx.DrawLine(XPens.Black, leftMargin, rowpos, pageWidth - rightMargin, rowpos);
        }

        protected void DrawLine(int x1, int y1, int x2, int y2)
        {
            gfx.DrawLine(XPens.Black, x1, y1, x2, y2);
        }

        protected void DrawLine(double x1, double y1, double x2, double y2)
        {
            gfx.DrawLine(XPens.Black, x1, y1, x2, y2);

        }
        protected int CharacterOffset(string x)
        {
            if (!string.IsNullOrEmpty(x))
            {
                if (x.Length > 1)
                {
                    return x.Length * 3;
                }
            }
            return 0;
        }

        protected double GetStringWidth(string data, XFont font)
        {
            if(string.IsNullOrEmpty(data))
            {
                return 0;
            }
            return gfx.MeasureString(data, font).Width;
        }

        protected int CharacterOffsetFont10(string x)
        {
            if (!string.IsNullOrEmpty(x))
            {
                if (x.Length > 1)
                {
                    return x.Length * 5;
                }
            }
            return 0;
        }

        protected int CharacterOffsetFont20(string x)
        {
            if (!string.IsNullOrEmpty(x))
            {
                if (x.Length > 1)
                {
                    return x.Length * 10;
                }
            }
            return 0;
        }

        protected abstract Guid CreateReport(T data);
    }
}

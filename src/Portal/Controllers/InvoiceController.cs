using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OpenIddict.Validation;
using ScentAir.Payment;
using ScentAir.Payment.Reports;
using ScentAir.Payment.ViewModels;
using Microsoft.AspNetCore.StaticFiles;
using ScentAir.Payment.Helpers;

namespace ScentAir.Payment.Controllers
{
    [Authorize(AuthenticationSchemes = OpenIddictValidationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : CommonController
    {
        private readonly IAccountManager _accountManager;
        private readonly IUnitOfWork _unitOfWork;

        public InvoiceController(
            ILoggerFactory loggerFactory,
            IAccountManager accountManager,
            IUnitOfWork unitOfWork)
            : base(loggerFactory)
        {

            _accountManager = accountManager;
            _unitOfWork = unitOfWork;
        }


        [HttpPost("open")]
        [ProducesResponseType(200, Type = typeof(InvoiceViewModel))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> OpenInvoices()
        {
            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;


            if (!ModelState.IsValid)
                return BadRequest();


            var openInvoices = await _accountManager.GetInvoicesAsync(accountNumber).SafeAsync(Log);
            if (openInvoices == null)
                return NoContent();

            return Ok(Mapper.Map<IEnumerable<InvoiceViewModel>>(openInvoices.OrderBy(x => x.InvoiceDate).ThenBy(x => x.InvoiceNumber)));
        }

        [HttpPost("closed")]
        [ProducesResponseType(200, Type = typeof(InvoiceViewModel))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> ClosedInvoices()
        {
            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;


            if (!ModelState.IsValid)
                return BadRequest();


            var closedInvoices = await _accountManager.GetInvoicesAsync(accountNumber, false, true).SafeAsync(Log);
            if (closedInvoices == null)
                return NoContent();

            return Ok(Mapper.Map<IEnumerable<InvoiceViewModel>>(closedInvoices.OrderBy(x => x.InvoiceDate).ThenBy(x => x.InvoiceNumber)));
        }

        [HttpGet("pdf")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetInvoicePdf([FromQuery]string InvoiceNumber)
        {
            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;


            if (!ModelState.IsValid)
                return BadRequest();


            var invoice = await _accountManager.GetInvoiceAsync(accountNumber, InvoiceNumber).SafeAsync(Log);
            if (invoice == null)
                return NoContent();

            //Author : Vinod Patil , Purpose : To fetch Customer and invoice header additional details to render in the invoice PDF

            var objInvoiceHeader = await _accountManager.GetInvoiceHeaderAdditionalAsync(accountNumber, InvoiceNumber).SafeAsync(Log);

            var objCustomerAchWire = await _accountManager.GetCompanyAchWireDetailsAsync(invoice.InvoiceNumber).SafeAsync(Log);

            //set default language incase Language value not populated
            invoice.BilledToAccount.Language = invoice.BilledToAccount?.Language == null ? "ENG" : invoice.BilledToAccount?.Language;

            var objLabelTranslate = Utilities.GetInvoiceTranslate(invoice.BilledToAccount?.Language);

            var _pdf = new InvoiceReportPDF();

            var id = _pdf.CreatePDF(invoice,objCustomerAchWire,objInvoiceHeader, objLabelTranslate);

            return Ok(new { id = id.ToString() });
        }


        [HttpGet("download")]
        [AllowAnonymous]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public FileResult DownloadDocument([FromQuery]Guid Id)
        {

            var InvoicePDF = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "ReportsPDF/" + Id.ToString() + ".pdf");
            if (System.IO.File.Exists(InvoicePDF))
            {

                var doc = System.IO.File.ReadAllBytes(InvoicePDF);

                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = "ScentAirInvoice.pdf",
                    Inline = true,
                };

                Response.Headers.Add("Content-Disposition", cd.ToString());

                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(InvoicePDF, out string contentType))
                {
                    contentType = "application/octet-stream";
                }

                return File(doc, contentType);
            }

            return null;
        }
    }
}
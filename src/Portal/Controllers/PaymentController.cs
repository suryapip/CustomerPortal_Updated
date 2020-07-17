using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ScentAir.Payment.ViewModels;
using AutoMapper;
using ScentAir.Payment.Models;
using ScentAir.Payment.Authorization;
using ScentAir.Payment.Helpers;
using Microsoft.AspNetCore.JsonPatch;
using ScentAir.Payment.Impl;
using OpenIddict.Validation;
using System.Security.Claims;
using System.Net;
using System.Net.Http;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace ScentAir.Payment.Controllers
{
    [Authorize(AuthenticationSchemes = OpenIddictValidationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class PaymentController : CommonController
    {
        private readonly IRegistrationManager registrationManager;
        private readonly IAccountManager accountManager;
        private readonly ISecurityManager securityManager;
        private readonly IAuthorizationService authorizationService;
        private readonly IImportManager importer;
        private readonly IOptions<ChaseConfig> config;

        public PaymentController(
            ILoggerFactory loggerFactory,
            IRegistrationManager registrationManager,
            IAccountManager accountManager,
            ISecurityManager securityManager,
            IAuthorizationService authorizationService,
            IImportManager importService,
            IOptions<ChaseConfig> config)
            : base(loggerFactory)
        {
            this.registrationManager = registrationManager;
            this.accountManager = accountManager;
            this.securityManager = securityManager;
            this.authorizationService = authorizationService;
            this.importer = importService;
            this.config = config;
        }


        [HttpPost("pay/{methodId}")]
        [ProducesResponseType(200, Type = typeof(PaymentResultViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> SubmitPayment([FromRoute][Required] string methodId, [Required][FromBody] PaymentRequestViewModel data)
        {

            if (!ModelState.IsValid)
                return BadRequest();


            if (!Guid.TryParse(methodId, out Guid id) || id == Guid.Empty)
                return NotFound();

            if ((data.Invoices?.Count ?? 0) == 0)
            {
                Log.LogInformation("No Invoices selected");
                return BadRequest("No Invoices selected");
            }
            if (data.PaymentAmount <= 0)
            {
                Log.LogInformation("Payment must be greater than 0");
                return BadRequest("Payment must be greater than 0");
            }

            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;

            var user1 = Request.HttpContext.User.Identity as ClaimsIdentity;
            var user = await securityManager.GetUserByUserNameAsync(user1.Name).SafeAsync(Log);

            var acct1 = await accountManager.GetAccountAsync(accountNumber);

            var acct = Mapper.Map<AccountViewModel>(acct1);


            var method = await accountManager.GetPaymentMethodAsync(accountNumber, id).SafeAsync(Log);
            if (method == null)
                return NotFound();

            var transactionNumber = await accountManager.BeginPaymentTransactionAsync(methodId, data.PaymentAmount, data.Invoices).SafeAsync(Log);
            if (transactionNumber.IsNullOrWhiteSpace())
            {
                Log.LogInformation("Could not record start of payment or The currency of your payment method does not match the invoice currency. Please select or setup an alternative Payment Method");
                return BadRequest($"Could not record start of payment or The currency of your payment method does not match the invoice currency. Please select or setup an alternative Payment Method");
            }

            var paymentResult = await accountManager.SubmitPaymentAsync(accountNumber, id, transactionNumber, data.PaymentAmount, data.Invoices).SafeAsync(Log);
            var payment = paymentResult.Result;


            if (!paymentResult.IsSuccessful || payment.ApprovalStatus != "1") //TODO : Validate Approval Status returned from Chase is correct
            {
                // Chase Response
                var chaseResponse = $"Account {accountNumber}, Transaction {transactionNumber}: Could not cancel payment. ConfirmationNumber: {payment?.ConfirmationNumber}, ProcessorStatus:{payment?.ProcessorStatus}, ApprovalStatus:{payment?.ApprovalStatus}, Message:{payment?.Message}";


                var cancel = await accountManager.CancelPaymentTransactionAsync(transactionNumber, chaseResponse, true).SafeAsync(false, Log);

                string emailMessage1 = EmailTemplates.PaymentDeclineEmail()
                     .Replace("{accountNumber}", acct.Number)
                     .Replace("{customerName}", acct.Name)
                     .Replace("{customerName}", user.Name)
                     .Replace("{name}", user.FirstName)
                     .Replace("{username}", user.UserName)
                     .Replace("{paymentNumber}", method.PaymentAccountNumber.Right(4))
                     .Replace("{errorMessage}", payment.Message)
                     .Replace("{profileId}", payment.CustomerProfile);


                var rslt1 = await registrationManager.SendPaymentDeclineEmailAsync(user, emailMessage1);
                Log.LogInformation($"Please Call Customer Support for {transactionNumber} which could not be canceled.  Bank result: '{payment?.Message}'");
                return BadRequest($"Please Call Customer Support for {transactionNumber} which could not be canceled.  Bank result: '{payment?.Message}'");
            }


            var result = await accountManager.CompletePaymentTransactionAsync(transactionNumber, payment.ConfirmationNumber, payment.ProcessorStatus, payment.ApprovalStatus).SafeAsync(false, Log);
            if (!result)
                return BadRequest($"Could not finalize payment");

            //send email

            string emailMessage = EmailTemplates.PaymentConfirmationEmail()
                 .Replace("{accountNumber}", acct.Number)
                 .Replace("{customerName}", acct.Name)
                 .Replace("{customerName}", user.Name)
                 .Replace("{name}", user.FirstName)
                 .Replace("{username}", user.UserName)
                 .Replace("{chaseRefNo}", payment.ConfirmationNumber)
                 .Replace("{paymentDateTime}", DateTime.Now.ToString())
                 .Replace("{confirmationDateTime}", DateTime.Now.ToString())
                 .Replace("{paymentAmount}", data.PaymentAmount.ToString())
                 .Replace("{paymentNumber}", method.PaymentAccountNumber.Right(4));


            var rslt = await registrationManager.SendPaymentConfirmationEmailAsync(user, emailMessage);

            var vm = Mapper.Map<PaymentResultViewModel>(payment);

            return Ok(vm);
        }


        [HttpGet("{methodId}")]
        [ProducesResponseType(200, Type = typeof(PaymentProfileViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetPaymentMethod([FromRoute][Required] string methodId)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;

            if (!Guid.TryParse(methodId, out Guid id))
                return BadRequest();


            var result = await accountManager.GetPaymentMethodAsync(accountNumber, id).SafeAsync(Log);
            if (result == null)
                return NotFound();


            var vm = Mapper.Map<PaymentProfileViewModel>(result);


            return Ok(vm);
        }


        [HttpGet("list")]
        [ProducesResponseType(200, Type = typeof(List<PaymentViewModel>))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetPaymentMethods()
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;


            var result = await accountManager.GetPaymentMethodsAsync(accountNumber).SafeAsync(Log);
            if (result == null)
                return NotFound();


            var vm = result.Select(Mapper.Map<PaymentViewModel>).ToList();


            return Ok(vm);
        }


        [HttpPut("auto")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<PaymentViewModel>))]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> SavePaymentMethod([Required][FromBody] PaymentViewModel data)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;

            var user1 = Request.HttpContext.User.Identity as ClaimsIdentity;
            var user = await securityManager.GetUserByUserNameAsync(user1.Name).SafeAsync(Log);

            if (data.isDefault)
            {
                //unenroll
                var rslt = await accountManager.UnenrollAutoPay(accountNumber);

                var rt = await registrationManager.SendUnenrollAutoPayEmailAsync(user, accountNumber, rslt.PaymentAccountNumber, EmailTemplates.GetAutopayUnenrollmentEmail());

                return Ok();

            }
            else
            {
                if (!Guid.TryParse(data.Id, out Guid id) || id == Guid.Empty)
                    return BadRequest();


                var result = await accountManager.SetPaymentMethodToCurrent(accountNumber, id, data.CurrentAutoPayMethod).SafeAsync(false, Log);
                if (!result)
                    return NotFound();

                var rt = await registrationManager.SendEnrollAutoPayEmailAsync(user, accountNumber, EmailTemplates.GetAutopayEnrollmentEmail());

                var payments = await accountManager.GetPaymentMethodsAsync(accountNumber).SafeAsync(Log);

                return Ok(payments.Select(Mapper.Map<PaymentViewModel>).ToList());

            }

        }


        [HttpPut]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PaymentViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> SaveProfile([FromBody][Required]PaymentProfileViewModel data)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;


            var pm = Mapper.Map<PaymentMethod>(data);


            if (pm.PaymentType == PaymentType.Unknown)
                return BadRequest("Payment Type is missing");

            if (string.IsNullOrWhiteSpace(pm.PaymentAccountNumber))
                return BadRequest("Account Number is missing");

            if (pm.PaymentType == PaymentType.ECP && string.IsNullOrWhiteSpace(pm.PaymentRoutingNumber))
                return BadRequest("Routing Number is missing");


            pm.AccountNumber = accountNumber;


            var result = await accountManager.SavePaymentMethod(pm).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest(result.Errors);
            //return StatusCode((int) HttpStatusCode.InternalServerError, "Could not save payment method.  Please try again later.");

            var vm = Mapper.Map<PaymentProfileViewModel>(result.Result);

            var user1 = Request.HttpContext.User.Identity as ClaimsIdentity;
            var user = await securityManager.GetUserByUserNameAsync(user1.Name).SafeAsync(Log);

            var acct1 = await accountManager.GetAccountAsync(accountNumber);

            var acct = Mapper.Map<AccountViewModel>(acct1);

            string emailMessage = EmailTemplates.PaymentMethodEmail()
                 .Replace("{accountNumber}", acct.Number)
                 .Replace("{customerName}", acct.Name)
                 .Replace("{name}", user.FirstName);


            var rslt = await registrationManager.SendPaymentMethodEmailAsync(user, emailMessage);

            return Ok(vm);
        }


        [HttpDelete("{methodId}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(bool))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> DeletePaymentMethod([FromRoute][Required] string methodId)
        {
            if (!Guid.TryParse(methodId, out Guid id))
                return BadRequest();


            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;


            var method = await accountManager.GetPaymentMethodAsync(accountNumber, id).SafeAsync(Log);
            if (method == null)
                return NotFound();

            method.IsDeleted = true;
            var result = await accountManager.SavePaymentMethod(method).SafeAsync(Log);

            return Ok(result.IsSuccessful);
        }
    }
}

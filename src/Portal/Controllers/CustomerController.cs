using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScentAir.Payment.ViewModels;
using AutoMapper;
using Microsoft.Extensions.Logging;
using ScentAir.Payment.Helpers;
using Microsoft.AspNetCore.Authorization;
using OpenIddict.Validation;
using System.Security.Claims;
using System.Linq;

namespace ScentAir.Payment.Controllers
{
    [Authorize(AuthenticationSchemes = OpenIddictValidationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : CommonController
    {
        private IUnitOfWork _unitOfWork;
        private readonly IEmailSender emailer;
        private readonly IAccountManager accountManager;

        public CustomerController(
            ILoggerFactory loggerFactory,
            IAccountManager accountManager,
            IEmailSender emailer,
            IUnitOfWork unitOfWork) 
            :base(loggerFactory)
        {
            _unitOfWork = unitOfWork;
            this.emailer = emailer;
            this.accountManager = accountManager;
        }

        [HttpPost("GetUserAccount")]
        [ProducesResponseType(200, Type = typeof(AccountViewModel))]
        public async Task<IActionResult> GetUserAccount()
        {
            var (accountNumber, response) = IsAuthorized();
            if (response != null)
                return response;


            var userAccount = await accountManager.GetAccountAsync(accountNumber).SafeAsync(Log);
            if (userAccount == null)
                return NotFound();


            return Ok(Mapper.Map<AccountViewModel>(userAccount));
        }


        [HttpGet]
        public IActionResult Get()
        {
            var allCustomers = _unitOfWork.Customers.GetAllCustomersData();

            return Ok(Mapper.Map<IEnumerable<AccountViewModel>>(allCustomers));
        }

        [HttpGet("email")]
        public async Task<IActionResult> Email()
        {
            string recepientName = "test"; //        
            string recepientEmail = "test@test.local"; //  

            string message = EmailTemplates.GetTestEmail(recepientName, DateTime.UtcNow);

            var result = await emailer.SendEmailAsync(recepientName, recepientEmail, "Test Email", message);

            return BadRequest(result.Errors);
        }

    }
}

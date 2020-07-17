using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OpenIddict.Validation;
using ScentAir.Payment.Models;
using ScentAir.Payment.ViewModels;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading.Tasks;

namespace ScentAir.Payment.Controllers
{
    [Authorize(AuthenticationSchemes = OpenIddictValidationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class SFAccountController : CommonController
    {
        private readonly ISFAccountSettingsManager sfAccountSettingsManager;

        public SFAccountController(
            ILoggerFactory loggerFactory,
            ISFAccountSettingsManager sfAccountSettingsManager)
            : base(loggerFactory)
        {
            this.sfAccountSettingsManager = sfAccountSettingsManager;
        }

        #region Account Settings

        [HttpGet("sfaccountsettings")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(SFAccountSettingsViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetSFAccountSettings()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var (accountNumber, response) = IsAuthorized();     // Use IsAuthorized() to get the Account Number.

            var vm = await getSFAccountSettingsViewModelHelper(accountNumber).SafeAsync(Log);

            if (vm == null)
                return NotFound();

            return Ok(vm);
        }

        private async Task<SFAccountSettingsViewModel> getSFAccountSettingsViewModelHelper(string accountNumber)
        {
            SFAccountSettings sfAccountSettings = await sfAccountSettingsManager.GetSFAccountSettingsAsync(accountNumber).SafeAsync(Log);
            if (sfAccountSettings == null)
                return null;

            var vm = Mapper.Map<SFAccountSettingsViewModel>(sfAccountSettings);

            return vm;
        }

        [HttpPut("savesfaccountsettings")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> SaveSFAccountSettings([FromBody][Required] SFAccountSettingsViewModel vmSFAccountSettings)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var dbSFAccountSettings = await sfAccountSettingsManager.GetSFAccountSettingsAsync(vmSFAccountSettings.AccountNumber).SafeAsync(Log);
            if (dbSFAccountSettings == null)
                return NotFound();

            dbSFAccountSettings.BillingLine1 = vmSFAccountSettings.BillingLine1;
            dbSFAccountSettings.BillingLine2 = vmSFAccountSettings.BillingLine2;
            dbSFAccountSettings.BillingLine3 = vmSFAccountSettings.BillingLine3;
            dbSFAccountSettings.BillingMunicipality = vmSFAccountSettings.BillingMunicipality;
            dbSFAccountSettings.BillingStateOrProvince = vmSFAccountSettings.BillingStateOrProvince;
            dbSFAccountSettings.BillingPostalCode = vmSFAccountSettings.BillingPostalCode;
            dbSFAccountSettings.BillingCountry = vmSFAccountSettings.BillingCountry;
            dbSFAccountSettings.ShippingLine1 = vmSFAccountSettings.ShippingLine1;
            dbSFAccountSettings.ShippingLine2 = vmSFAccountSettings.ShippingLine2;
            dbSFAccountSettings.ShippingLine3 = vmSFAccountSettings.ShippingLine3;
            dbSFAccountSettings.ShippingMunicipality = vmSFAccountSettings.ShippingMunicipality;
            dbSFAccountSettings.ShippingStateOrProvince = vmSFAccountSettings.ShippingStateOrProvince;
            dbSFAccountSettings.ShippingPostalCode = vmSFAccountSettings.ShippingPostalCode;
            dbSFAccountSettings.ShippingCountry = vmSFAccountSettings.ShippingCountry; 

            var result = await sfAccountSettingsManager.SaveSFAccountSettingsAsync(dbSFAccountSettings).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not update account settings");

            return NoContent();
        }

        #endregion SFAccountSettings

        #region SFContacts

        [HttpGet("sfcontacts")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<SFContactViewModel>))]
        public async Task<IActionResult> GetSFContacts() => await GetSFContacts(-1, -1);

        [HttpGet("sfcontacts/{pageNumber:int}/{pageSize:int}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<SFContactViewModel>))]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetSFContacts(int pageNumber, int pageSize)
        {
            var (accountNumber, response) = IsAuthorized();     // Use IsAuthorized() to get the Account Number.

            var dbSFContacts = await sfAccountSettingsManager.GetSFContactsAsync(accountNumber, pageNumber, pageSize).SafeAsync(Log);
            if (dbSFContacts == null)
                return NotFound();

            var result = new List<SFContactViewModel>();
            foreach (var sfContact in dbSFContacts)
            {
                var vm = Mapper.Map<SFContactViewModel>(sfContact);
                result.Add(vm);
            }

            return Ok(result);
        }

        [HttpGet("sfcontact/{id:int}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(SFContactViewModel))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetSFContact(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var vm = await GetSFContactViewModelHelper(id).SafeAsync(Log);

            if (vm == null)
                return NotFound();

            return Ok(vm);
        }

        private async Task<SFContactViewModel> GetSFContactViewModelHelper(int id)
        {
            SFContact sfContact = await sfAccountSettingsManager.GetSFContactAsync(id).SafeAsync(Log);
            if (sfContact == null)
                return null;

            var vm = Mapper.Map<SFContactViewModel>(sfContact);

            return vm;
        }

        [HttpPost("savesfcontact")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> SaveSFContact([FromBody][Required] SFContactViewModel vmSFContact)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var dbSFContact = await sfAccountSettingsManager.GetSFContactAsync(vmSFContact.Id).SafeAsync(Log);
            bool isNew = dbSFContact == null;
            if (isNew)
                dbSFContact = new SFContact();

            dbSFContact.AccountNumber = vmSFContact.AccountNumber;
            dbSFContact.FirstName = vmSFContact.FirstName;
            dbSFContact.LastName = vmSFContact.LastName;
            dbSFContact.Email = vmSFContact.Email;
            dbSFContact.Phone = vmSFContact.Phone;
            dbSFContact.MainContact = vmSFContact.MainContact;
            dbSFContact.BillingContact = vmSFContact.BillingContact;
            dbSFContact.ShippingContact = vmSFContact.ShippingContact;
            dbSFContact.ServiceContact = vmSFContact.ServiceContact;
            dbSFContact.PropertyContact = vmSFContact.PropertyContact;
            dbSFContact.InstallationContact = vmSFContact.InstallationContact;
            dbSFContact.MarketingContact = vmSFContact.MarketingContact;
            dbSFContact.DoNotCall = vmSFContact.DoNotCall;
            dbSFContact.DoNotEmail = vmSFContact.DoNotEmail;
            dbSFContact.Active = vmSFContact.Active;

            var result = await sfAccountSettingsManager.SaveSFContactAsync(dbSFContact).SafeAsync(Log);
            if (!result.IsSuccessful)
                return BadRequest("Could not save contact");

            if (isNew)
            {
                var vm = await GetSFContactViewModelHelper(result.Result.Id).SafeAsync(Log);
                return CreatedAtAction(nameof(GetSFContact), new { id = vm.Id }, vm);
            }
            else
            {
                return NoContent();
            }

        }

        #endregion

    }
}

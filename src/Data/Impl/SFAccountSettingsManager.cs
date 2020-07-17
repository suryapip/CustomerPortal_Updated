using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ScentAir.Payment;
using ScentAir.Payment.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment.Impl
{
    public class SFAccountSettingsManager : ISFAccountSettingsManager
    {
        private readonly PortalDbContext portalContext;
        private readonly ILogger<SFAccountSettingsManager> logger;

        public SFAccountSettingsManager(
            PortalDbContext portalContext,
            IConfiguration configuration,
            ILoggerFactory loggerFactory,
            IHttpContextAccessor httpAccessor)
        {
            this.portalContext = portalContext;
            this.logger = loggerFactory.CreateLogger<SFAccountSettingsManager>();
        }
        public SFAccountSettingsManager(
            PortalDbContext portalContext,
            IConfiguration configuration,
            ILoggerFactory loggerFactory
            ) : this(portalContext, configuration, loggerFactory, null)
        {
        }

        #region SFAccountSettings

        public async Task<SFAccountSettings> GetSFAccountSettingsAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken))
        {
            var qry = portalContext.SFAccountSettings
                .Where(a => a.AccountNumber == accountNumber);

            var data = await qry
                .SingleOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);

            return data;
        }

        public async Task<ITaskResult> SaveSFAccountSettingsAsync(SFAccountSettings sfAccountSettings, CancellationToken cancellationToken = default(CancellationToken))
        {
            var dbSFAccountSettings = null as SFAccountSettings;
            if (sfAccountSettings == null) return dbSFAccountSettings.AsFailure().Add(nameof(SFAccountSettings), "Error saving account settings - parameter is null");

            dbSFAccountSettings = await GetSFAccountSettingsAsync(sfAccountSettings.AccountNumber, cancellationToken);

            var eSFAccountSettings = null as EntityEntry<SFAccountSettings>;
            if (dbSFAccountSettings == null)
            {
                // If the SFAccountSettings are prepopulated by Richa's SalesForce sync process, then we should never need to "add" a record.
                eSFAccountSettings = await portalContext.AddAsync(new SFAccountSettings
                {
                    AccountNumber = sfAccountSettings.AccountNumber,
                    BillingLine1 = sfAccountSettings.BillingLine1,
                    BillingLine2 = sfAccountSettings.BillingLine2,
                    BillingLine3 = sfAccountSettings.BillingLine3,
                    BillingMunicipality = sfAccountSettings.BillingMunicipality,
                    BillingStateOrProvince = sfAccountSettings.BillingStateOrProvince,
                    BillingPostalCode = sfAccountSettings.BillingPostalCode,
                    BillingCountry = sfAccountSettings.BillingCountry,
                    ShippingLine1 = sfAccountSettings.ShippingLine1,
                    ShippingLine2 = sfAccountSettings.ShippingLine2,
                    ShippingLine3 = sfAccountSettings.ShippingLine3,
                    ShippingMunicipality = sfAccountSettings.ShippingMunicipality,
                    ShippingStateOrProvince = sfAccountSettings.ShippingStateOrProvince,
                    ShippingPostalCode = sfAccountSettings.ShippingPostalCode,
                    ShippingCountry = sfAccountSettings.ShippingCountry,
                }, cancellationToken);
            }
            else
            {
                dbSFAccountSettings.CopyNotNull(x => x.BillingLine1, sfAccountSettings);
                dbSFAccountSettings.BillingLine2 = sfAccountSettings.BillingLine2;
                dbSFAccountSettings.BillingLine3 = sfAccountSettings.BillingLine3;
                dbSFAccountSettings.BillingMunicipality = sfAccountSettings.BillingMunicipality;
                dbSFAccountSettings.BillingStateOrProvince = sfAccountSettings.BillingStateOrProvince;
                dbSFAccountSettings.BillingPostalCode = sfAccountSettings.BillingPostalCode;
                dbSFAccountSettings.BillingCountry = sfAccountSettings.BillingCountry;
                dbSFAccountSettings.ShippingLine1 = sfAccountSettings.ShippingLine1;
                dbSFAccountSettings.ShippingLine2 = sfAccountSettings.ShippingLine2;
                dbSFAccountSettings.ShippingLine3 = sfAccountSettings.ShippingLine3;
                dbSFAccountSettings.ShippingMunicipality = sfAccountSettings.ShippingMunicipality;
                dbSFAccountSettings.ShippingStateOrProvince = sfAccountSettings.ShippingStateOrProvince;
                dbSFAccountSettings.ShippingPostalCode = sfAccountSettings.ShippingPostalCode;
                dbSFAccountSettings.ShippingCountry = sfAccountSettings.ShippingCountry;

                eSFAccountSettings = portalContext.Update(dbSFAccountSettings);
            }

            var count = await portalContext.SaveChangesAsync(cancellationToken).CatchDbAsync(-1, logger);

            dbSFAccountSettings = eSFAccountSettings.Entity;

            if (count < 0)
                return dbSFAccountSettings.AsFailure().Add(nameof(SFAccountSettings), "Error saving account settings");

            return dbSFAccountSettings.AsSuccess();
        }

        #endregion

        #region SFContacts

        public async Task<IList<SFContact>> GetSFContactsAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken)) => await GetSFContactsAsync(accountNumber, -1, -1);

        public async Task<IList<SFContact>> GetSFContactsAsync(string accountNumber, int page, int pageSize, CancellationToken cancellationToken = default(CancellationToken))
        {
            IQueryable<SFContact> qry = portalContext.SFContacts
                .Where(a => a.AccountNumber == accountNumber)
                .OrderByDescending(a => a.MainContact)              // Main contact at the top
                .ThenByDescending(a => a.BillingContact             // Followed by all of the contacts with other roles
                                    || a.ShippingContact
                                    || a.ServiceContact
                                    || a.PropertyContact
                                    || a.InstallationContact
                                    || a.MarketingContact)
                .ThenByDescending(a => a.Active)                    // Sort "roled" contacts and "unroled" contacts by their Active status
                .ThenBy(a => a.FirstName)                           // Finally sort the above sections by name.
                .ThenBy(a => a.LastName);

            if (page != -1)
                qry = qry.Skip((page - 1) * pageSize);

            if (pageSize != -1)
                qry = qry.Take(pageSize);

            var sfContacts = await qry
                .ToListAsync(cancellationToken)
                .CatchDbAsync(logger);

            if (sfContacts == null)
                return new SFContact[0];

            return sfContacts.ToList();
        }

        public async Task<SFContact> GetSFContactAsync(int id, CancellationToken cancellationToken = default(CancellationToken))
        {
            var qry = portalContext.SFContacts
                .Where(a => a.Id == id);

            var data = await qry
                .SingleOrDefaultAsync(cancellationToken)
                .CatchDbAsync(logger);

            return data;
        }

        public async Task<ITaskResult<SFContact>> SaveSFContactAsync(SFContact sfContact, CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = new TaskResultBuilder<SFContact>();

            var dbSFContact = null as SFContact;
            if (sfContact == null)
                return result.Add(nameof(SFContact), "Error saving contact - parameter is null").Fail();

            dbSFContact = await GetSFContactAsync(sfContact.Id, cancellationToken);

            var eSFContact = null as EntityEntry<SFContact>;
            if (dbSFContact == null)
            {
                eSFContact = await portalContext.AddAsync(new SFContact
                {
                    AccountNumber = sfContact.AccountNumber,
                    FirstName = sfContact.FirstName,
                    LastName = sfContact.LastName,
                    Email = sfContact.Email,
                    Phone = sfContact.Phone,
                    MainContact = sfContact.MainContact,
                    BillingContact = sfContact.BillingContact,
                    ShippingContact = sfContact.ShippingContact,
                    ServiceContact = sfContact.ServiceContact,
                    PropertyContact = sfContact.PropertyContact,
                    InstallationContact = sfContact.InstallationContact,
                    MarketingContact = sfContact.MarketingContact,
                    DoNotCall = sfContact.DoNotCall,
                    DoNotEmail = sfContact.DoNotEmail,
                    Active = sfContact.Active
                }, cancellationToken);
            }
            else
            {
                dbSFContact.FirstName = sfContact.FirstName;
                dbSFContact.LastName = sfContact.LastName;
                dbSFContact.Email = sfContact.Email;
                dbSFContact.Phone = sfContact.Phone;
                dbSFContact.MainContact = sfContact.MainContact;
                dbSFContact.BillingContact = sfContact.BillingContact;
                dbSFContact.ShippingContact = sfContact.ShippingContact;
                dbSFContact.ServiceContact = sfContact.ServiceContact;
                dbSFContact.PropertyContact = sfContact.PropertyContact;
                dbSFContact.InstallationContact = sfContact.InstallationContact;
                dbSFContact.MarketingContact = sfContact.MarketingContact;
                dbSFContact.DoNotCall = sfContact.DoNotCall;
                dbSFContact.DoNotEmail = sfContact.DoNotEmail;
                dbSFContact.Active = sfContact.Active;

                eSFContact = portalContext.Update(dbSFContact);
            }

            var count = await portalContext.SaveChangesAsync(cancellationToken).CatchDbAsync(-1, logger);

            dbSFContact = eSFContact.Entity;

            if (count < 0)
                return result.Add(nameof(SFContact), "Error saving account settings").Fail();

            return result.Success(dbSFContact);
        }

        #endregion

    }
}

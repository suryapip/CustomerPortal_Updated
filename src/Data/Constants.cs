using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment
{
    public static class Constants
    {
        public static class Logging
        {            
            public static class Data
            {
                static readonly string prefix = "Data";

                public static readonly string X3 = $"{prefix}.X3";
                public static readonly string Portal = $"{prefix}.Portal";
            }

        }
        public static class Configuration
        {
            public const string ExternalPath = "path.external";

            public static class Options
            {
                public const string EnablePaymentMethodAutoSelectOnChange = "options.paymentmethod.autoselect.onchange";
                public const string OverridePin = "options.account.pin.override";
                public const string SkipEmailConfirmation = "options.email.confirmation.skip";

                public const string PortalConnectionForceSql = "options.force.sql.portal";
                public const string X3ConnectionForceSql = "options.force.sql.x3";

				public const string ImportEnabled = "options.import.enabled";
				public const string ImportInterval = "options.import.interval";
				public const string ImportLookupInterval = "options.import.lookup.interval";
				public const string AutoPayEnabled = "options.autopay.enabled";
				public const string AutoPayInterval = "options.autopay.interval";
                public const string FailedEmailId = "options.autopay.FailedEmail";
                public const string importAccountCustFailedEmailId = "bi_database_alerts @scentair.com";
            }
            public static class Security
            {
                public const string Identifier = "security.identifier";
                public const string Secret = "security.secret";
                public const string PathRoot = "security.client.path.base";
                public const string PathSignin = "security.client.path.signin";
                public const string PathAfterSignout = "security.client.path.signout";
            }
            public static class Data
            {
                public const string X3Connection = "ConnectionStrings:X3";
                public const string PortalConnection = "ConnectionStrings:Portal";
            }
            public static class Test
            {
                public const string Security = "test.security";
                public const string SeedData = "test.seed";
                public const string Pin = "test.pin";
            }
        }
        public static class Roles
        {
            public const string SystemAdministrator = "sys_admin";
            public const string CompanyAdministrator = "corp_admin";
            public const string AccountAdministrator = "acct_admin";

            public const string CompanyUser = "corp_user";
            public const string AccountUser = "acct_user";
        }
        public static class ClaimTypes
        {
            ///<summary>A claim that specifies the permission of an entity</summary>
            public const string Permission = "permission";

            ///<summary>A claim that specifies the full name of an entity</summary>
            public const string FullName = "fullname";

            ///<summary>A claim that specifies the job title of an entity</summary>
            public const string JobTitle = "jobtitle";

            ///<summary>A claim that specifies the email of an entity</summary>
            public const string Email = "email";

            ///<summary>A claim that specifies the phone number of an entity</summary>
            public const string Phone = "phone";

            ///<summary>A claim that specifies the configuration/customizations of an entity</summary>
            public const string Configuration = "configuration";
            public const string Account = "acct";
        }

    }
}

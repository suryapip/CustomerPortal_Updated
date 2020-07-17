using System;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ScentAir.Payment.Helpers
{
    public static class EmailTemplates
    {
        static IHostingEnvironment _hostingEnvironment;
        static string testEmailTemplate;
        static string RegistrationConfirmationEmailTemplate;
        static string ForgotUsernameEmailTemplate;
        static string ForgotPasswordEmailTemplate;
        static string plainTextTestEmailTemplate;
        static string ChangePasswordEmailTemplate;
        static string PaymentConfirmationEmailTemplate;
        static string AutopayUnenrollmentEmailTemplate;
        static string AutopayEnrollmentEmailTemplate;
        static string PaymentMethodEmailTemplate;
        static string PaymentDeclineEmailTemplate;
        static string AutoPaymentFailedEmailTemplate;

        public static void UseEnvironment(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }


        public static string GetTestEmail(string recepientName, DateTime testDate)
        {
            if (testEmailTemplate == null)
                testEmailTemplate = readFile("Templates/TestEmail.template");


            string emailMessage = testEmailTemplate
                .Replace("{user}", recepientName)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }

        public static string PaymentMethodEmail()
        {
            if (PaymentMethodEmailTemplate == null)
                PaymentMethodEmailTemplate = readFile("Templates/PaymentMethodEmail.template");


            return PaymentMethodEmailTemplate;
        }

        public static string PaymentConfirmationEmail()
        {
            if (PaymentConfirmationEmailTemplate == null)
                PaymentConfirmationEmailTemplate = readFile("Templates/PaymentConfirmationEmail.template");


            return PaymentConfirmationEmailTemplate;
        }

        public static string PaymentDeclineEmail()
        {
            if (PaymentDeclineEmailTemplate == null)
                PaymentDeclineEmailTemplate = readFile("Templates/PaymentDeclineEmail.template");


            return PaymentDeclineEmailTemplate;
        }

        public static string GetRegistrationConfirmationEmail(string customerName, string accountNumber, string userName, string url)
        {
            if (RegistrationConfirmationEmailTemplate == null)
                RegistrationConfirmationEmailTemplate = readFile("Templates/RegistrationConfirmationEmail.template");

            string emailMessage = testEmailTemplate
                .Replace("{customerName}", customerName)
                .Replace("{accountNumber}", accountNumber)
                .Replace("{name}", userName)
                .Replace("{url}", url);


            return emailMessage;
        }
        public static string GetRegistrationConfirmationEmail(string language)
        {

            switch (string.IsNullOrEmpty(language) ? null : language.ToUpper())
            {
                case "FRA":
                    RegistrationConfirmationEmailTemplate = readFile("Templates/RegistrationConfirmationEmail-fr.template");
                    break;
                case "SPA":
                    RegistrationConfirmationEmailTemplate = readFile("Templates/RegistrationConfirmationEmail-es.template");
                    break;
                case "DUT":
                    RegistrationConfirmationEmailTemplate = readFile("Templates/RegistrationConfirmationEmail-de.template");
                    break;
                default:
                    RegistrationConfirmationEmailTemplate = readFile("Templates/RegistrationConfirmationEmail-en.template");
                    break;
            }



            return RegistrationConfirmationEmailTemplate;
        }

        public static string GetAutopayUnenrollmentEmail()
        {
            if (AutopayUnenrollmentEmailTemplate == null)
                AutopayUnenrollmentEmailTemplate = readFile("Templates/AutopayUnenrollmentEmail.template");

            return AutopayUnenrollmentEmailTemplate;
        }

        public static string GetAutopayEnrollmentEmail()
        {
            if (AutopayEnrollmentEmailTemplate == null)
                AutopayEnrollmentEmailTemplate = readFile("Templates/AutopayEnrollmentEmail.template");

            return AutopayEnrollmentEmailTemplate;
        }

        public static string ForgotUsernameEmail(string customerName, string accountNumber, string userName, string username, string url)
        {
            if (ForgotUsernameEmailTemplate == null)
                ForgotUsernameEmailTemplate = readFile("Templates/ForgotUsernameEmail.template");

            string emailMessage = ForgotUsernameEmailTemplate
                .Replace("{customerName}", customerName)
                .Replace("{accountNumber}", accountNumber)
                .Replace("{name}", userName)
                .Replace("{username}", username)
                .Replace("{url}", url);


            return emailMessage;
        }


        public static string ForgotUsernameEmail(string language)
        {
             
                switch (string.IsNullOrEmpty(language) ? null : language.ToUpper())
                {
                    case "FRA":
                        ForgotUsernameEmailTemplate = readFile("Templates/ForgotUsernameEmail-fr.template");
                        break;
                    case "SPA":
                        ForgotUsernameEmailTemplate = readFile("Templates/ForgotUsernameEmail-es.template");
                        break;
                    case "DUT":
                        ForgotUsernameEmailTemplate = readFile("Templates/ForgotUsernameEmail-de.template");
                        break;
                    default:
                        ForgotUsernameEmailTemplate = readFile("Templates/ForgotUsernameEmail-en.template");
                        break;
                }
             

            return ForgotUsernameEmailTemplate;
        }

        public static string ForgotPasswordEmail(string language)
        {
          
                switch (string.IsNullOrEmpty(language) ? null : language.ToUpper())
                {
                    case "FRA":
                        ForgotPasswordEmailTemplate = readFile("Templates/ForgotPasswordEmail-fr.template");
                        break;
                    case "SPA":
                        ForgotPasswordEmailTemplate = readFile("Templates/ForgotPasswordEmail-es.template");
                        break;
                    case "DUT":
                        ForgotPasswordEmailTemplate = readFile("Templates/ForgotPasswordEmail-de.template");
                        break;
                    default:
                        ForgotPasswordEmailTemplate = readFile("Templates/ForgotPasswordEmail-en.template");
                        break;
                }

             


            return ForgotPasswordEmailTemplate;
        }

        public static string ForgotPasswordEmail(string customerName, string accountNumber, string userName, string username, string url)
        {
            if (ForgotPasswordEmailTemplate == null)
                ForgotPasswordEmailTemplate = readFile("Templates/ForgotPasswordEmail.template");

            string emailMessage = ForgotPasswordEmailTemplate
                .Replace("{customerName}", customerName)
                .Replace("{accountNumber}", accountNumber)
                .Replace("{name}", userName)
                .Replace("{username}", username)
                .Replace("{url}", url);


            return emailMessage;
        }

        public static string ChangePasswordEmail(string customerName, string accountNumber, string userName, string url)
        {
            if (ChangePasswordEmailTemplate == null)
                ChangePasswordEmailTemplate = readFile("Templates/ChangePasswordEmail.template");

            string emailMessage = ChangePasswordEmailTemplate
                .Replace("{customerName}", customerName)
                .Replace("{accountNumber}", accountNumber)
                .Replace("{name}", userName)
                .Replace("{url}", url);


            return emailMessage;
        }

        public static string ChangePasswordEmail(string language)
        {
            
                switch (string.IsNullOrEmpty(language) ? null : language.ToUpper())
                {
                    case "FRA":
                        ChangePasswordEmailTemplate = readFile("Templates/ChangePasswordEmail-fr.template");
                        break;
                    case "SPA":
                        ChangePasswordEmailTemplate = readFile("Templates/ChangePasswordEmail-es.template");
                        break;
                    case "DUT":
                        ChangePasswordEmailTemplate = readFile("Templates/ChangePasswordEmail-de.template");
                        break;
                    default:
                        ChangePasswordEmailTemplate = readFile("Templates/ChangePasswordEmail-en.template");
                        break;
                }
            


            return ChangePasswordEmailTemplate;
        }



        public static string GetPlainTextTestEmail(DateTime date)
        {
            if (plainTextTestEmailTemplate == null)
                plainTextTestEmailTemplate = readFile("Templates/PlainTextTestEmail.template");


            var emailMessage = plainTextTestEmailTemplate
                .Replace("{date}", date.ToString());

            return emailMessage;
        }

        


        private static string readFile(string path)
        {
            if (_hostingEnvironment == null)
                throw new InvalidOperationException($"{nameof(EmailTemplates)} is not initialized");

            var fileInfo = _hostingEnvironment.ContentRootFileProvider.GetFileInfo(path);

            if (!fileInfo.Exists)
                throw new FileNotFoundException($"Template file located at \"{path}\" was not found");

            using (var fs = fileInfo.CreateReadStream())
            {
                using (var sr = new StreamReader(fs))
                {
                    return sr.ReadToEnd();
                }
            }
        }
    }
}

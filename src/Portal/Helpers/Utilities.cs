using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ScentAir.Payment.Models;
using ScentAir.Payment.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment.Helpers
{
    public static class Utilities
    {
        static ILoggerFactory factory;


        public static void UseFactory(ILoggerFactory loggerFactory)
        {
            factory = loggerFactory;
        }


        public static ILogger CreateLogger<T>()
        {
            if (factory == null)
            {
                throw new InvalidOperationException($"{nameof(ILogger)} is not configured. {nameof(UseFactory)} must be called before use");
                //_loggerFactory = new LoggerFactory().AddConsole().AddDebug();
            }

            return factory.CreateLogger<T>();
        }


        public static void QuickLog(string text, string filename)
        {
            string dirPath = Path.GetDirectoryName(filename);

            if (!Directory.Exists(dirPath))
                Directory.CreateDirectory(dirPath);

            using (StreamWriter writer = File.AppendText(filename))
            {
                writer.WriteLine($"{DateTime.Now} - {text}");
            }
        }



        public static string GetUserId(ClaimsPrincipal user)
        {
            return user.FindFirst(OpenIdConnectConstants.Claims.Subject)?.Value?.Trim();
        }



        public static string[] GetRoles(ClaimsPrincipal identity)
        {
            return identity.Claims
                .Where(c => c.Type == OpenIdConnectConstants.Claims.Role)
                .Select(c => c.Value)
                .ToArray();
        }

        public static InvoiceTranslate GetInvoiceTranslate(string language)
        {
            var fileName = string.Empty;

            switch (string.IsNullOrEmpty(language) ? null : language.ToUpper())
            {
                case "FRA":
                    fileName = Path.Combine(@"InvoiceLocale", "fra.json");
                    break;
                case "SPA":
                    fileName = Path.Combine(@"InvoiceLocale", "spa.json");
                    break;
                case "DUT":
                    fileName = Path.Combine(@"InvoiceLocale", "dut.json");
                    break;
                default:
                    fileName = Path.Combine(@"InvoiceLocale", "en.json");
                    break;
            }

            return JsonConvert.DeserializeObject<InvoiceTranslate>(File.ReadAllText(fileName));
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ScentAir.Payment.Controllers
{
    public abstract class CommonController : Controller
    {
        public CommonController(ILoggerFactory loggerFactory)
        {
            this.Log = loggerFactory.AddLog4Net().CreateLogger(this.GetType());

            //this.Log.LogInformation("Initializing Application...");
        }

        protected readonly ILogger Log;

        protected (string accountNumber, IActionResult response) IsAuthorized()
        {
            var user = Request.HttpContext.User.Identity as ClaimsIdentity;
            if (user == null)
                return (null, Challenge());


            var accountNumber = user.Claims.Where(x => x.Type == Constants.ClaimTypes.Account).Select(x => x.Value).FirstOrDefault();
            if (string.IsNullOrEmpty(accountNumber))
                return (null, Unauthorized());

            return (accountNumber, null);
        }
    }
}

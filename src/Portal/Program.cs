using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ScentAir.Payment.Helpers;
using ScentAir.Payment;
using Microsoft.Extensions.Configuration;
using System.Threading;

namespace ScentAir.Payment.Portal
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //AppDomain.CurrentDomain.UnhandledException += currentDomain_UnhandledException;
            //AppDomain.CurrentDomain.FirstChanceException += currentDomain_FirstChanceException;

            var builder = WebHost
                .CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .CaptureStartupErrors(true)
                .ConfigureLogging((hostingContext, logging) =>
                  {
                      logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                      logging.AddConsole();
                      logging.AddDebug();
                      logging.AddEventSourceLogger();
                  });


            var host = builder.Build();


            Task.Factory.StartNew(async () =>
            {
                using (var scope = host.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;

                    Utilities.UseFactory(services.GetRequiredService<ILoggerFactory>());


                    var databaseInitializer = services.GetRequiredService<IDatabaseInitializer>();

                    //await databaseInitializer.TestSecurityLocalAsync(CancellationToken.None);
                    //await databaseInitializer.TestAsync();

                    await databaseInitializer.InitializeAsync(CancellationToken.None);
                }
            }).Wait(30000);

            host.Run();
        }

        private static void currentDomain_FirstChanceException(object sender, System.Runtime.ExceptionServices.FirstChanceExceptionEventArgs e) => Console.WriteLine(e.Exception);
        private static void currentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e) => Console.WriteLine(e.ExceptionObject);
    }
}

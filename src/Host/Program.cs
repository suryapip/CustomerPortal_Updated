using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security;
using System.Security.Permissions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.WindowsServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ScentAir.Payment
{
    public class Program
    {
        private static readonly string pathToExe = Process.GetCurrentProcess().MainModule.FileName;
        private static readonly string pathToContentRoot = Debugger.IsAttached
                                                         ? Path.GetDirectoryName(Environment.GetCommandLineArgs()[0])
                                                         : Path.GetDirectoryName(pathToExe);

        [SecurityCritical]
        [SecurityPermission(SecurityAction.Demand, Unrestricted = true)]
        public static void Main(string[] args)
        {
            if (args.Length <= 1)
            {
                var builder = CreateWebHostBuilder(args).Build();
                builder.RunAsServiceHost(args);


                //var isService = !(Debugger.IsAttached || args.Contains("--console"));
                //var builder = CreateWebHostBuilder(args).Build();

                //if (isService)
                //    builder.RunAsService();
                //else
                //    builder.RunAsServiceHost(args);

                return;
            }

            //if (args.Length != 3)
            //    return;

            //var install = args[0].Equals("--install", StringComparison.OrdinalIgnoreCase);
            //var uninstall = args[0].Equals("--uninstall", StringComparison.OrdinalIgnoreCase);

            //if (!(install || uninstall))
            //    return;


            //var pi = new ProcessStartInfo
            //{
            //    CreateNoWindow = true,
            //    LoadUserProfile = false,
            //    UseShellExecute = true,
            //    RedirectStandardOutput = true,
            //    RedirectStandardError = true,
            //    RedirectStandardInput = true,
            //    WorkingDirectory = pathToContentRoot,
            //};

            //pi.ArgumentList
            //    .Append(install ? "create" : "delete")
            //    .Append(args[1]);

            //if (install)
            //    pi.ArgumentList.Append($"binPath= \"{pathToExe}\"");


            //var p = Process.Start(pi);
            //if (!p.WaitForExit(10000))
            //    p.Kill();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {

            return WebHost.CreateDefaultBuilder(args)
                .UseContentRoot(pathToContentRoot)
                .UseStartup<Startup>()
                .CaptureStartupErrors(true)
               .ConfigureLogging((hostingContext, logging) =>
               {
                   logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                   logging.AddConsole();
                   logging.AddDebug();
                   logging.AddEventSourceLogger();
               });

        }
    }
}

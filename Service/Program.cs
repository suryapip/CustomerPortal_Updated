using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment.Service
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(params string[] args)
        {
            ServiceBase[] ServicesToRun;

            if (!Environment.UserInteractive)
            {
                ServicesToRun = new ServiceBase[] { new WindowsService() };

                ServiceBase.Run(ServicesToRun);
            }
            else
            {
                var service = new WindowsService();
                var key = ConsoleKey.A;

                service.Start(args).ConfigureAwait(false);

                while (key != ConsoleKey.Escape ||
                       key != ConsoleKey.End ||
                       key != ConsoleKey.Enter ||
                       key != ConsoleKey.Spacebar)
                    key = Console.ReadKey().Key;

                service.Stop(false);
            }
        }
    }
}

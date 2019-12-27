using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment.Service
{
    public partial class WindowsService : ServiceBase
    {
        private CancellationTokenSource cancellationTokenSource;
        private bool restartable;

        public WindowsService()
        {
            InitializeComponent();

            cancellationTokenSource = new CancellationTokenSource();
        }

        protected override void OnStart(string[] args)
        {
            if (restartable)
                cancellationTokenSource = cancellationTokenSource ?? new CancellationTokenSource();
        }

        protected override void OnStop()
        {
            try { cancellationTokenSource?.Cancel(); }
            catch { }
            finally { cancellationTokenSource?.Dispose(); }
        }

        internal async Task Start(string[] args)
        {
            await Task.Factory.StartNew(
                () => OnStart(args), 
                cancellationTokenSource.Token, 
                TaskCreationOptions.AttachedToParent | 
                TaskCreationOptions.LongRunning,
                TaskScheduler.Default ?? Task.Factory.Scheduler);
        }
        internal void Stop(bool restartable)
        {
            this.restartable = restartable;

            OnStop();
        }
    }
}

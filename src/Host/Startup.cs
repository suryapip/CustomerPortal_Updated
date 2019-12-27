using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ScentAir.Payment.Impl;

namespace ScentAir.Payment
{
    internal class Startup
    {

		private readonly IConfiguration configuration;
		private readonly IHostingEnvironment environment;
		private readonly ILoggerFactory loggerFactory;
		private readonly bool seedTestData;
		private readonly bool forceSqlX3;
		private readonly bool forceSqlPortal;
		private readonly InMemoryDatabaseRoot memPortalDb;
		private readonly InMemoryDatabaseRoot memX3Db;

		public Startup(IConfiguration configuration, IHostingEnvironment environment, ILoggerFactory loggerFactory)
		{
			this.configuration = configuration;
			this.environment = environment;
			this.loggerFactory = loggerFactory;
            Host.UseEnvironment(environment);


			//var rsa = RSACng.Create(2048);
			//var cr = new CertificateRequest("CN=a", rsa, HashAlgorithmName.SHA512, RSASignaturePadding.Pkcs1);
			//var cert = cr.CreateSelfSigned(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddYears(20));


			//var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
			//store.Open(OpenFlags.ReadWrite);
			//var existing = store.Certificates.Find(X509FindType.FindBySubjectName, "CN=a", true)?.Cast<X509Certificate2>().FirstOrDefault();
			//store.Add(cert);



			bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Test.SeedData), out seedTestData);
			bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Options.X3ConnectionForceSql), out forceSqlX3);
			bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Options.PortalConnectionForceSql), out forceSqlPortal);


			if (!forceSqlPortal && (seedTestData || environment.IsDevelopment()))
				memPortalDb = new InMemoryDatabaseRoot();
			if (!forceSqlX3 && (seedTestData || environment.IsDevelopment()))
				memX3Db = new InMemoryDatabaseRoot();
		}


	
	    public void ConfigureServices(IServiceCollection services)
        {
			// Configurations
			services.Configure<SmtpConfig>(configuration.GetSection("SmtpConfig"));
			services.Configure<ChaseConfig>(configuration.GetSection("ChaseConfig"));

			services
				.AddScoped<IUnitOfWork, HttpUnitOfWork>()
				.AddScoped<IAccountManager, AccountManager>()
				.AddScoped<ILookupManager, LookupManager>()
                .AddSingleton<IImportManager, ImportManager>();

			services
				.AddLogging(options =>
				{
					options
						.AddConfiguration(configuration.GetSection("Logging"))
						.AddDebug()
						.AddEventLog()
						;

					if (Environment.UserInteractive)
						options.AddConsole();

					options.SetMinimumLevel(LogLevel.Trace);

				})
				.AddDbContext<PortalDbContext>(options =>
				{
					if (!forceSqlPortal && (seedTestData || environment.IsDevelopment()))
						options.UseInMemoryDatabase("Portal", memPortalDb);
					else
						options.UseSqlServer(configuration[Constants.Configuration.Data.PortalConnection], b => b.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName));
				}, ServiceLifetime.Scoped, ServiceLifetime.Singleton)
				.AddDbContext<X3DbContext>(options =>
				{
					if (!forceSqlX3 && (seedTestData || environment.IsDevelopment()))
						options.UseInMemoryDatabase("X3", memX3Db);
					else
						options.UseSqlServer(configuration[Constants.Configuration.Data.X3Connection]); //, b => b.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName));

				}, ServiceLifetime.Scoped, ServiceLifetime.Singleton)
				;		
		}


		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app)
		{
			//var config = configuration.GetSection("Logging");


			//loggerFactory.AddConsole(config);
			//loggerFactory.AddDebug(LogLevel.Debug);
			//loggerFactory.AddFile(config);
   //         loggerFactory.AddFile("Logs/mylog-{Date}.txt");


            loggerFactory.AddConsole(configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
           // loggerFactory.AddLog4Net(configuration.GetValue<string>("Log4NetConfigFile:Name"));
        }
	}
}

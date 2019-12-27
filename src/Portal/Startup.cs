using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using ScentAir.Payment.Impl;
using ScentAir.Payment.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Infrastructure;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.DataProtection.Cng;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.AspNetCore.DataProtection.Internal;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using OpenIddict.EntityFrameworkCore;
using ScentAir.Payment.Authorization;
using ScentAir.Payment.Helpers;
using ScentAir.Payment.ViewModels;
using Serilog.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;
using System;
using Priviledge = ScentAir.Payment.ApplicationPermissions;
using System.Reflection;
using Microsoft.AspNetCore.SpaServices;
using System.Linq;
using Microsoft.EntityFrameworkCore.Storage;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;

namespace ScentAir.Payment.Portal
{
    public class Startup
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


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configurations
            services.Configure<SmtpConfig>(configuration.GetSection("SmtpConfig"));
			services.Configure<ChaseConfig>(configuration.GetSection("ChaseConfig"));

			services
                .AddScoped<IEmailSender, EmailSender>()
                .AddScoped<IUnitOfWork, HttpUnitOfWork>()
                .AddScoped<IAccountManager, AccountManager>()
                .AddScoped<ILookupManager, LookupManager>()
                .AddScoped<ISecurityManager, SecurityManager>()
                .AddScoped<IRegistrationManager, RegistrationManager>()

                .AddSingleton<IAuthorizationHandler, ViewUserAuthorizationHandler>()
                .AddSingleton<IAuthorizationHandler, ManageUserAuthorizationHandler>()
                .AddSingleton<IAuthorizationHandler, ViewRoleAuthorizationHandler>()
                .AddSingleton<IAuthorizationHandler, AssignRolesAuthorizationHandler>()

                .AddSingleton<IImportManager, ImportManager>()

                
                .AddScoped<IDatabaseInitializer, DatabaseInitializer>();

            //   .AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connection));

            //services.AddTransient<IEmailSender, AuthMessageSender>();
            //services.AddTransient<ISmsSender, AuthMessageSender>();

            //services.AddEntityFrameworkInMemoryDatabase();




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
                .AddIdentity<ApplicationUser, ApplicationRole>()
                    .AddEntityFrameworkStores<PortalDbContext>()
                    .AddDefaultTokenProviders()
                    .Services
                .Configure<IdentityOptions>(options =>
                {
                    // User settings
                    options.User.AllowedUserNameCharacters = new string(options.User.AllowedUserNameCharacters.Except(new[] { '@', '+' }).ToArray());
                    //options.User.RequireUniqueEmail = true;


                    // Password settings
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 8;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = true;

                    //options.SignIn.RequireConfirmedEmail
                    //options.SignIn.RequireConfirmedPhoneNumber

                    // Lockout settings
                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(2 * 60);
                    options.Lockout.MaxFailedAccessAttempts = 5;

                    options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                    options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                    options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
                })
                .AddAuthorization(options =>
                {
                    options.AddPolicy(Authorization.Policies.ViewAllUsersPolicy, policy => policy.RequireClaim(Constants.ClaimTypes.Permission, Priviledge.ViewUsers));
                    options.AddPolicy(Authorization.Policies.ManageAllUsersPolicy, policy => policy.RequireClaim(Constants.ClaimTypes.Permission, Priviledge.ManageUsers));

                    options.AddPolicy(Authorization.Policies.ViewAllRolesPolicy, policy => policy.RequireClaim(Constants.ClaimTypes.Permission, Priviledge.ViewRoles));
                    options.AddPolicy(Authorization.Policies.ViewRoleByRoleNamePolicy, policy => policy.Requirements.Add(new ViewRoleAuthorizationRequirement()));
                    options.AddPolicy(Authorization.Policies.ManageAllRolesPolicy, policy => policy.RequireClaim(Constants.ClaimTypes.Permission, Priviledge.ManageRoles));

                    options.AddPolicy(Authorization.Policies.AssignAllowedRolesPolicy, policy => policy.Requirements.Add(new AssignRolesAuthorizationRequirement()));
                })
                .AddOpenIddict(builder => builder
                    .AddCore(options =>
                    {
                        options
                            .UseEntityFrameworkCore()
                            .UseDbContext<PortalDbContext>();
                    })
                    .AddServer(options =>
                    {
                        options.UseMvc();

                        options
                            .EnableTokenEndpoint("/connect/token")
                            .EnableAuthorizationEndpoint("/connect/authorize")
                            .EnableLogoutEndpoint("/connect/logout")
                            .EnableUserinfoEndpoint("/api/userinfo")

                            .AllowAuthorizationCodeFlow()
                            .AllowPasswordFlow()
                            .AllowRefreshTokenFlow()

                            .AcceptAnonymousClients()

                            .RegisterScopes(
                                OpenIdConnectConstants.Scopes.OpenId,
                                OpenIdConnectConstants.Scopes.Email,
                                OpenIdConnectConstants.Scopes.Phone,
                                OpenIdConnectConstants.Scopes.Profile,
                                OpenIdConnectConstants.Scopes.OfflineAccess,
                                OpenIddictConstants.Scopes.Roles
                            );

                        if (environment.IsDevelopment())
                            options.DisableHttpsRequirement(); // Note: Comment this out in production

                        // options.UseRollingTokens(); //Uncomment to renew refresh tokens on every refreshToken request
                        // Note: to use JWT access tokens instead of the default encrypted format, the following lines are required:
                        //options.UseJsonWebTokens();
                    })
                    .AddValidation()//Only compatible with the default token format. For JWT tokens, use the Microsoft JWT bearer handler.
                )
                .AddDataProtection(options =>
                {
                    options.ApplicationDiscriminator = nameof(ScentAir.Payment.Portal);
                })
                //.ProtectKeysWithCertificate("a")
                ;
                

            // Add framework services.
            services
                .AddCors()
                .AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1).Services
                .AddSpaStaticFiles(config =>
                {
                    config.RootPath = "ClientApp/dist"; // In production, the Angular files will be served from this directory
                })
                //.AddJsonOptions(opts =>
                //{
                //    opts.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                //})
                ;

#if !DEBUG
            //Todo: ***Using DataAnnotations for validation until Swashbuckle supports FluentValidation***
            //services.AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Portal API", Version = "v1" });
                c.OperationFilter<AuthorizeCheckOperationFilter>();
                c.AddSecurityDefinition("oauth2", new OAuth2Scheme
                {
                    Type = "oauth2",
                    Flow = "password",
                    TokenUrl = "/connect/token",
                    Description = "Note: Leave client_id and client_secret blank"
                });
            });
#endif
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            var config = configuration.GetSection("Logging");

            
            Utilities.UseFactory(loggerFactory);
            loggerFactory.AddConsole(config);
            loggerFactory.AddDebug(LogLevel.Debug);
            loggerFactory.AddFile(config);
            loggerFactory.AddLog4Net();



            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
          

            EmailTemplates.UseEnvironment(environment);


            app.UseSpaStaticFiles();

            app
                .UseAuthentication()
                .UseStaticFiles()
                .UseHttpsRedirection()                
                .UseMvc(routes =>
                {
                    //routes.MapRoute(
                    //    name: "default",
                    //    template: "{controller}/{action=Index}/{id?}");
                        
                    routes.MapRoute(
                        name: "api",
                        template: "api/{controller}/{action=Index}/{id?}");
                })
                .UseCors(builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod())
                    ;



            if (environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

#if !DEBUG
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.DocumentTitle = "Swagger UI - Portal";
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portal API V1");
                });
#endif
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            if (environment.IsDevelopment())
                app.UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501
                    spa.Options.SourcePath = "ClientApp";

                    spa.UseAngularCliServer(npmScript: "start");
                    spa.Options.StartupTimeout = TimeSpan.FromSeconds(120); // Increase the timeout if angular app is taking longer to startup
                });
            else
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp/dist";
                });
        }


    }
}

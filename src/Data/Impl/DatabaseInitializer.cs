using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using OpenIddict.Core;
using OpenIddict.EntityFrameworkCore.Models;
using ScentAir.Payment.Models;
using X3 = ScentAir.Payment.Models.X3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using System.Security.Claims;

namespace ScentAir.Payment.Impl
{
	public class DatabaseInitializer : IDatabaseInitializer
	{
		private readonly ILogger logger;
		private readonly IHostingEnvironment environment;
		private readonly IConfiguration configuration;
		private readonly IServiceProvider services;
		private readonly IAccountManager accountManager;
		private readonly ISecurityManager securityManager;
		private readonly PortalDbContext portalContext;
		private readonly X3DbContext x3context;
		private readonly bool forceSqlX3;
		private readonly bool seedTestData;
		private readonly bool forceSqlPortal;
		private readonly bool enableSecurityTest;

		public DatabaseInitializer(
			ILogger<DatabaseInitializer> logger,
			IConfiguration configuration,
			IHostingEnvironment environment,
			IServiceProvider services,

			IAccountManager accountManager,
			ISecurityManager securityManager,

			PortalDbContext portalContext,
			X3DbContext x3context)
		{
			this.logger = logger;
			this.configuration = configuration;
			this.environment = environment;
			this.services = services;

			this.accountManager = accountManager;
			this.securityManager = securityManager;

			this.portalContext = portalContext;
			this.x3context = x3context;

			bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Options.X3ConnectionForceSql), out forceSqlX3);
			bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Options.PortalConnectionForceSql), out forceSqlPortal);
			bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Test.SeedData), out seedTestData);
			bool.TryParse(configuration.GetValue<string>(Constants.Configuration.Test.Security), out enableSecurityTest);
		}

		public async Task InitializeAsync(CancellationToken cancellationToken)
		{
			if (forceSqlPortal || !(environment.IsDevelopment()))
				await portalContext.Database.MigrateAsync(cancellationToken).ConfigureAwait(false);


			await seedLookupDataAsync(cancellationToken);
			await seedSecurityDataAsync(cancellationToken);



			if (forceSqlX3 || !(environment.IsDevelopment()) || !seedTestData) //we don't want to fill the export table store with fake data we won't clean up
				return;


			await seedTestDataAsync(cancellationToken);

			//disabled
			//if (true || !seedTestData || forceSqlPortal) //we don't need the remainder as we can import now.
			return;


#pragma warning disable CS0162 // Unreachable code detected
			if (!await portalContext.Accounts.AnyAsync(cancellationToken))
#pragma warning restore CS0162 // Unreachable code detected
			{
				logger.LogInformation("Seeding initial data: started");
				var i = 0;

				var cust_1 = new Account
				{
					Name = $"Customer {++i}",
					Number = "1234561",
					Pin = "123456",
					Email = "cust@test.local",
					CreatedOn = DateTime.UtcNow,
					PhysicalAddress = new Address()
					{
						Id = Guid.NewGuid(),
						Line1 = "100 Long Road",
						Line2 = "P.O. Box 14567",
						Municipality = "Orlando",
						Country = "USA",
						StateOrProvince = "FL",
						PostalCode = "52698-1025"
					}
				};

				var cust_2 = new Account
				{
					Name = $"Customer {++i}",
					Number = "1234562",
					Pin = "123456",
					Email = "cust@test.local",
					PhoneNumber = "+12345678922",
					PhysicalAddress = new Address()
					{
						Id = Guid.NewGuid(),
						Line1 = "100 Circle Driver",
						Line2 = "P.O. Box 14567",
						Municipality = "Orlando",
						Country = "USA",
						StateOrProvince = "FL",
						PostalCode = "52698-1025"
					},
					CreatedOn = DateTime.UtcNow,
				};

				var cust_3 = new Account
				{
					Name = $"Customer {++i}",
					Number = "1234563",
					Pin = "123456",
					Email = "cust@test.local",
					PhoneNumber = "+12345678922",
					PhysicalAddress = new Address
					{
						Id = Guid.NewGuid(),
						Line1 = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet",
						Municipality = "Lorem Ipsum",
					},

					CreatedOn = DateTime.UtcNow,
				};

				var cust_4 = new Account
				{
					Name = $"Customer {++i}",
					Number = "1234564",
					Pin = "123456",

					Email = "cust@test.local",
					PhoneNumber = "+12345678922",
					PhysicalAddress = new Address
					{
						Id = Guid.NewGuid(),
						Line1 = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet",
						Municipality = "Lorem Ipsum",
					},
					CreatedOn = DateTime.UtcNow,
				};

				portalContext.Accounts.Add(cust_1);
				portalContext.Accounts.Add(cust_2);
				portalContext.Accounts.Add(cust_3);
				portalContext.Accounts.Add(cust_4);

				await portalContext.SaveAsync();

				var ordr_1 = new Invoice
				{
					DiscountAmount = 500,
					//Cashier = await context.Users.FirstAsync(),
					BilledToAccount = cust_1,
					CreatedOn = DateTime.UtcNow,
					DateDue = DateTime.Parse("1/1/2019"),
					SubTotalAmount = (decimal)(44 * 1.49 + 1 * 1.01),
					TaxAmount = (decimal)(44 * 1.49 * 1 * 1.01 * .08),
					Balance = (decimal)(44 * 1.49 * 1 * 1.01) + (decimal)(44 * 1.49 * 1 * 1.01 * .08),
					Details = new List<InvoiceDetail>()
					{
						new InvoiceDetail { LineNumber = 1, UnitPrice = 1.01M, Quantity=1 },
						new InvoiceDetail { LineNumber = 2, UnitPrice = 1.49M, Quantity=44 },
					}
				};

				var ordr_2 = new Invoice
				{
					//Cashier = await context.Users.FirstAsync(),
					BilledToAccount = cust_2,
					CreatedOn = DateTime.UtcNow,
					DateDue = DateTime.Parse("12/1/2018"),
					SubTotalAmount = (decimal)(13.01 * 5),
					TaxAmount = (decimal)(13.01 * 5 * .08),
					Balance = (decimal)(13.01 * 5),
					Details = new List<InvoiceDetail>()
					{
						new InvoiceDetail() { LineNumber = 1, UnitPrice = 13.01M, Quantity=5 },
					}
				};




				portalContext.Invoices.Add(ordr_1);
				portalContext.Invoices.Add(ordr_2);

				await portalContext.SaveAsync();

				logger.LogInformation("Seeding initial data: complete");
			}
		}

		private async Task seedLookupDataAsync(CancellationToken cancellationToken)
		{
			logger.LogInformation("Seeding build-in identity questions: started");


			await ensureLookupAsync(1, new IdentityQuestion { Id = 1, ReferenceEnglishId = 1, Question = "What is your Mother's maiden name?", Order = 1, Language="EN" }, cancellationToken);
			await ensureLookupAsync(2, new IdentityQuestion { Id = 2, ReferenceEnglishId = 2, Question = "In what city where you born?", Order = 2, Language = "EN" }, cancellationToken);
			await ensureLookupAsync(3, new IdentityQuestion { Id = 3, ReferenceEnglishId = 3, Question = "What brand was your first car?", Order = 3, Language = "EN" }, cancellationToken);
			await ensureLookupAsync(4, new IdentityQuestion { Id = 4, ReferenceEnglishId = 4, Question = "Name of your childhood best friend?", Order = 4, Language = "EN" }, cancellationToken);
			await ensureLookupAsync(5, new IdentityQuestion { Id = 5, ReferenceEnglishId = 5, Question = "Favorite vacation spot?", Order = 5, Language = "EN" }, cancellationToken);
			await ensureLookupAsync(6, new IdentityQuestion { Id = 6, ReferenceEnglishId = 6, Question = "Name of your first employer?", Order = 6, Language = "EN" }, cancellationToken);

            await ensureLookupAsync(7, new IdentityQuestion { Id = 7, ReferenceEnglishId = 1, Question = "Quel est le nom de jeune fille de votre mère ?", Order = 1, Language = "FR" }, cancellationToken);
            await ensureLookupAsync(8, new IdentityQuestion { Id = 8, ReferenceEnglishId = 2, Question = "Dans quelle ville êtes vous né(e) ?", Order = 2, Language = "FR" }, cancellationToken);
            await ensureLookupAsync(9, new IdentityQuestion { Id = 9, ReferenceEnglishId = 3, Question = "Quelle était la marque de votre première voiture ?", Order = 3, Language = "FR" }, cancellationToken);
            await ensureLookupAsync(10, new IdentityQuestion { Id = 10, ReferenceEnglishId = 4, Question = "Quel est le nom de votre meilleur(e) ami(e) d'enfance ?", Order = 4, Language = "FR" }, cancellationToken);
            await ensureLookupAsync(11, new IdentityQuestion { Id = 11, ReferenceEnglishId = 5, Question = "Quel est votre destination préférée pour les vacances ?", Order = 5, Language = "FR" }, cancellationToken);
            await ensureLookupAsync(12, new IdentityQuestion { Id = 12, ReferenceEnglishId = 6, Question = "Quel est le nom de votre premier employeur ?", Order = 6, Language = "FR" }, cancellationToken);


            await ensureLookupAsync(13, new IdentityQuestion { Id = 13, ReferenceEnglishId = 1, Question = "¿Cuál es el apellido de soltera de tu madre?", Order = 1, Language = "ES" }, cancellationToken);
            await ensureLookupAsync(14, new IdentityQuestion { Id = 14, ReferenceEnglishId = 2, Question = "¿En qué ciudad naciste?", Order = 2, Language = "ES" }, cancellationToken);
            await ensureLookupAsync(15, new IdentityQuestion { Id = 15, ReferenceEnglishId = 3, Question = "¿Qué marca fue tu primer coche?", Order = 3, Language = "ES" }, cancellationToken);
            await ensureLookupAsync(16, new IdentityQuestion { Id = 16, ReferenceEnglishId = 4, Question = "¿Cuál es el nombre del mejor amigo de tu infancia?", Order = 4, Language = "ES" }, cancellationToken);
            await ensureLookupAsync(17, new IdentityQuestion { Id = 17, ReferenceEnglishId = 5, Question = "¿Cuál es tu lugar de vacaciones favorito?", Order = 5, Language = "ES" }, cancellationToken);
            await ensureLookupAsync(18, new IdentityQuestion { Id = 18, ReferenceEnglishId = 6, Question = "¿Cuál es el nombre de su primer empleador?", Order = 6, Language = "ES" }, cancellationToken);

            await ensureLookupAsync(19, new IdentityQuestion { Id = 19, ReferenceEnglishId = 1, Question = "Wat is de meisjesnaam van uw moeder?", Order = 1, Language = "DE" }, cancellationToken);
            await ensureLookupAsync(20, new IdentityQuestion { Id = 20, ReferenceEnglishId = 2, Question = "In welke stad bent u geboren?", Order = 2, Language = "DE" }, cancellationToken);
            await ensureLookupAsync(21, new IdentityQuestion { Id = 21, ReferenceEnglishId = 3, Question = "Van welk merk was uw eerste auto?", Order = 3, Language = "DE" }, cancellationToken);
            await ensureLookupAsync(22, new IdentityQuestion { Id = 22, ReferenceEnglishId = 4, Question = "Wat is de naam van uw beste jeugdvriend(in)?", Order = 4, Language = "DE" }, cancellationToken);
            await ensureLookupAsync(23, new IdentityQuestion { Id = 23, ReferenceEnglishId = 5, Question = "Wat is uw favoriete vakantie bestemming?", Order = 5, Language = "DE" }, cancellationToken);
            await ensureLookupAsync(24, new IdentityQuestion { Id = 24, ReferenceEnglishId = 6, Question = "Wat is de naam van uw eerste werkgever?", Order = 6, Language = "DE" }, cancellationToken);


            logger.LogInformation("Seeding build-in identity questions: complete");
		}
		private async Task seedSecurityDataAsync(CancellationToken cancellationToken)
		{
			if (await portalContext.Users.AnyAsync(cancellationToken))
				return;


			logger.LogInformation("Seeding build-in account generation: started");


			await ensureRoleAsync(Constants.Roles.SystemAdministrator, null, "System Administrator", ApplicationPermissions.GetAllPermissionValues(), cancellationToken);
			await ensureRoleAsync(Constants.Roles.AccountAdministrator, null, "Account Administrator", new string[] { }, cancellationToken);
			await ensureRoleAsync(Constants.Roles.AccountUser, null, "Account User", new string[] { }, cancellationToken);
			await ensureRoleAsync(Constants.Roles.CompanyAdministrator, null, "Corporate Administrator", new string[] { }, cancellationToken);
			await ensureRoleAsync(Constants.Roles.CompanyUser, null, "Corporate User", new string[] { }, cancellationToken);

			await ensureUserAsync("admin", "Test123$", "Builtin Administrator", "admin@test.local", "+1 (123) 000-0000", new[] { Constants.Roles.SystemAdministrator }, null, cancellationToken);
			//await createUserAsync("user", "Test123$", "Builtin Standard User", "user@test.local", "+1 (123) 000-0001", new string[] { Constants.Roles.User });


			logger.LogInformation("Seeding build-in account generation: complete");

		}
		private async Task seedTestDataAsync(CancellationToken cancellationToken)
		{
			if (await x3context.Customers.AnyAsync(cancellationToken))
				return;

			logger.LogInformation("Seeding test x3 data: started");

			var random = new Random(DateTime.UtcNow.TimeOfDay.Milliseconds);

			for (var i = 0; i < 10; i++)
			{

				var seller = getTestCustomer(0, getTestAddress());

				var address = getTestAddress();
				var customer = getTestCustomer(i, address);
				var shipToAddress = getTestAddress();
				var remitAddress = getTestAddress();


				x3context.Add(customer);

				await x3context.SaveAsync();


				for (var ii = 0; ii < 10; ii++)
				{
					var number = DateTime.UtcNow.Ticks.ToString();

					var cur = Math.IEEERemainder(ii, 2) == 0 ? "USD" : "CAD";
					var terms = Math.IEEERemainder(ii, 3) == 0 ? "Net 30" : Math.IEEERemainder(ii, 3) == 1 ? "Tomorrow" : "Yesterday";
					var taxrate = 4;

					var inv = new X3.Invoice
					{
						RowVersion = BitConverter.GetBytes(DateTime.UtcNow.Ticks),

						Number = $"{number}-{ii}",
						CustomerPO = DateTime.UtcNow.ToString("yyMMddhhmm-ss") + $"{ii}",
						CustomerReferenceNumber = DateTime.UtcNow.ToString("HELLOyyMMddhhmm-ssBYE"),

						BillToName = customer.Name,
						BillTo = customer,
						BillToAddress1 = address.Line1,
						BillToAddress2 = address.Line2,
						BillToAddress3 = address.Line3,
						BillToCity = address.Municipality,
						BillToCountry = address.Country,
						BillToState = address.StateOrProvince,
						BillToPostalCode = address.PostalCode,

						SoldTo = customer,
						Payterms = terms,
						Incoterms = "idk",
						Memo = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet",

						CompanyName = seller.Name,
						Address1 = seller.Address1,
						Address2 = seller.Address2,
						Address3 = seller.Address3,
						City = seller.City,
						State = seller.State,
						Country = seller.Country,
						PostalCode = seller.PostalCode,
						Email = string.Empty,
						Phone = seller.Phone,
						Fax = string.Empty,
						Currency = cur,
						WireBankId = "1",
						WireBranch = "2",
						WireBank = "First National Bank, NA",
						WireName = seller.Name,
						WireRoutingNumber = "9000001",
						WireAccountNumber = "987123456",
						TaxID = "97-5556442",

						BalanceCurrency = cur,
						TaxRate = (decimal)0.054d,

						Date = DateTime.Now.AddDays(ii + -60),
						DateDue = DateTime.Now.AddDays(ii + -30),
						DetStartDate = DateTime.Now.AddDays(ii + -45),
						DetEndDate = DateTime.Now.AddDays(ii + -40),
						StartDate = DateTime.Now.AddDays(ii + -45),

						ShipVia = "FedEx",
						ShipToName = customer.Name,
						ShipToAddress1 = shipToAddress.Line1,
						ShipToAddress2 = shipToAddress.Line2,
						ShipToAddress3 = shipToAddress.Line3,
						ShipToCity = shipToAddress.Municipality,
						ShipToCountry = shipToAddress.Country,
						ShipToState = shipToAddress.StateOrProvince,
						ShipToPostal = shipToAddress.PostalCode,

						RemitName = seller.Name,
						RemitCurrency = cur,
						RemitAddress1 = remitAddress.Line1,
						RemitAddress2 = remitAddress.Line2,
						RemitAddress3 = remitAddress.Line3,
						RemitCity = remitAddress.Municipality,
						RemitCountry = remitAddress.Country,
						RemitState = remitAddress.StateOrProvince,
						RemitPostalCode = remitAddress.PostalCode,
					};
					x3context.Add(inv);
					await x3context.SaveAsync();

					var n = random.Next(0, 20);

					for (var ij = 0; ij < n; ij++)
					{
						var detail = new X3.InvoiceDetail
						{
							RowVersion = BitConverter.GetBytes(DateTime.UtcNow.Ticks),

							InvoiceNumber = inv.Number,
							LineNumber = ij,
							Item = $"Item Number {ij}",
							Description = $"Really long description for Item {ij} Testing",
							UnitPrice = (decimal)(random.NextDouble() * 4.59d),
							Quantity = random.Next(0, 100),
						};
						detail.Total = detail.UnitPrice * detail.Quantity;
						detail.Invoice = inv;

						inv.InvoiceDetails.Add(detail);

						x3context.Add(detail);
					}

					inv.Subtotal = inv.InvoiceDetails.Sum(x => x.Total);
					inv.PaidAmount = Math.IEEERemainder(random.Next(1, 10), 2) == 0 ? 0 : (decimal)(random.NextDouble() * 10d);
					inv.TaxRate = taxrate / 100;
					inv.TaxAmount = inv.Subtotal * (taxrate / 100);
					inv.Balance = (inv.Subtotal + inv.TaxAmount - inv.PaidAmount);

					await x3context.SaveAsync();
				}
			}

			logger.LogInformation("Seeding test x3 data: complete");

		}


		public async Task TestSecurityLocalAsync(CancellationToken cancellationToken)
		{
			if (!enableSecurityTest)
				return;


			var secret = Guid.Empty;
			var clientId = null as string;
			var basePath = null as Uri;
			var login = null as Uri;
			var postSignout = null as Uri;

			var useSsl = !(environment.IsDevelopment());

			var configClientId = configuration.GetValue<string>(Constants.Configuration.Security.Identifier) ?? "localhost";
			var configSecret = configuration.GetValue<string>(Constants.Configuration.Security.Secret);
			var configBase = configuration.GetValue<string>(Constants.Configuration.Security.PathRoot);
			var configLogin = configuration.GetValue<string>(Constants.Configuration.Security.PathSignin);
			var configAfterLogout = configuration.GetValue<string>(Constants.Configuration.Security.PathAfterSignout);


			clientId = configClientId ?? "localhost";



			var ipAddress = new Lazy<IPAddress>(() => NetworkInterface
					.GetAllNetworkInterfaces()
					.Where(x => x.NetworkInterfaceType != NetworkInterfaceType.Loopback)
					.Where(x => x.OperationalStatus == OperationalStatus.Up ||
								x.OperationalStatus == OperationalStatus.Unknown ||
								x.OperationalStatus == OperationalStatus.Testing)
					.SelectMany(x => x
						.GetIPProperties()
						.UnicastAddresses
						.Where(u => u.IsDnsEligible)
						.Where(u => u.Address.AddressFamily == AddressFamily.InterNetworkV6 ||
									u.Address.AddressFamily == AddressFamily.InterNetwork)
						.Select(u => u.Address))
					.FirstOrDefault());


			if (string.IsNullOrWhiteSpace(configBase) ||
				!Uri.TryCreate(configBase, UriKind.Absolute, out basePath))
				basePath = new UriBuilder(
					useSsl ? Uri.UriSchemeHttps : Uri.UriSchemeHttp,
					Dns.GetHostEntry(ipAddress.Value)?.HostName ?? "localhost").Uri;


			if (string.IsNullOrWhiteSpace(configSecret) ||
				!Guid.TryParse(configSecret, out secret))
				secret = new Guid(ipAddress.Value.MapToIPv6().GetAddressBytes());

			if (string.IsNullOrWhiteSpace(configLogin) ||
				!Uri.TryCreate(configLogin, UriKind.RelativeOrAbsolute, out login))
				login = new Uri("/login", UriKind.Relative);

			if (string.IsNullOrWhiteSpace(configAfterLogout) ||
				!Uri.TryCreate(configLogin, UriKind.RelativeOrAbsolute, out postSignout))
				postSignout = new Uri("/login", UriKind.Relative);

			//basePath = new Uri(login.IsAbsoluteUri
			//            ? login.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
			//            : postSignout.IsAbsoluteUri
			//            ? postSignout.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
			//            : configBase
			//            , UriKind.Absolute);


			if (!login.IsAbsoluteUri)
				login = new Uri(basePath, login);
			if (!postSignout.IsAbsoluteUri)
				postSignout = new Uri(basePath, login);


			// Create a new service scope to ensure the database context is correctly disposed when this methods returns.
			using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
			{
				var context = scope.ServiceProvider.GetRequiredService<PortalDbContext>();

				// Note: when using a custom entity or a custom key type, replace OpenIddictApplication by the appropriate type.
				var manager = scope.ServiceProvider.GetRequiredService<OpenIddictApplicationManager<OpenIddictApplication>>();

				if (await manager.FindByClientIdAsync(clientId, cancellationToken) == null)
				{
					var descriptor = new OpenIddictApplicationDescriptor
					{
						ClientId = clientId,
						ClientSecret = secret.ToString("D"),
						RedirectUris = { login },
						PostLogoutRedirectUris = { postSignout },
						Permissions =
						{
							OpenIddictConstants.Permissions.Endpoints.Authorization,
							OpenIddictConstants.Permissions.Endpoints.Logout,
							OpenIddictConstants.Permissions.Endpoints.Token,
							OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
							OpenIddictConstants.Permissions.GrantTypes.RefreshToken,
							OpenIddictConstants.Permissions.Scopes.Email,
							OpenIddictConstants.Permissions.Scopes.Profile,
							OpenIddictConstants.Permissions.Scopes.Roles
						}
					};

					await manager.CreateAsync(descriptor, cancellationToken);
				}
			}
		}

		public async Task TestSecurityPostmanAsync(CancellationToken cancellationToken)
		{
			// Create a new service scope to ensure the database context is correctly disposed when this methods returns.
			using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
			{
				var context = scope.ServiceProvider.GetRequiredService<PortalDbContext>();

				// Note: when using a custom entity or a custom key type, replace OpenIddictApplication by the appropriate type.
				var manager = scope.ServiceProvider.GetRequiredService<OpenIddictApplicationManager<OpenIddictApplication>>();


				if (await manager.FindByClientIdAsync("postman", cancellationToken) == null)
				{
					var descriptor = new OpenIddictApplicationDescriptor
					{
						ClientId = "postman",
						DisplayName = "Postman",
						RedirectUris = { new Uri("https://www.getpostman.com/oauth2/callback") },
						Permissions =
						{
							OpenIddictConstants.Permissions.Endpoints.Authorization,
							OpenIddictConstants.Permissions.Endpoints.Token,
							OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
							OpenIddictConstants.Permissions.Scopes.Email,
							OpenIddictConstants.Permissions.Scopes.Profile,
							OpenIddictConstants.Permissions.Scopes.Roles
						}
					};

					await manager.CreateAsync(descriptor, cancellationToken);
				}
			}
		}


		private static Address getTestAddress()
		{
			var addresses = new[]
			{
				new Address
				{
					Id = Guid.NewGuid(),
					Line1 = "100 Long Road",
					Line2 = "P.O. Box 14567",
					Municipality = "Orlando",
					Country = "USA",
					StateOrProvince = "FL",
					PostalCode = "52698-1025"
				},
				new Address
				{
					Id = Guid.NewGuid(),
					Line1 = "99999 Short Road",
					Line2 = "Suite 201B",
					Municipality = "Paris",
					Country = "USA",
					StateOrProvince = "TX",
					PostalCode = "77479"
				},
				new Address
				{
					Id = Guid.NewGuid(),
					Line1 = "99999 N Really Long Road to Nowhere Blvd",
					Municipality = "Portland",
					Country = "USA",
					StateOrProvince = "OR",
					PostalCode = "74564"
				},
				new Address
				{
					Id = Guid.NewGuid(),
					Line1 = "1 5th Ave",
					Municipality = "New York",
					Country = "USA",
					StateOrProvince = "NY",
					PostalCode = "11105"
				}
			};

			var random = new Random(DateTime.UtcNow.TimeOfDay.Milliseconds);
			var j = random.Next(0, addresses.Length - 1);

			return addresses[j];
		}
		private static X3.Customer getTestCustomer(int i, Address address)
		{
			return new X3.Customer
			{
				RowVersion = BitConverter.GetBytes(DateTime.UtcNow.Ticks),

				Name = $"Customer {i}, Inc.",
				CustomerNumber = $"123456{i}",

				Address1 = address.Line1,
				Address2 = address.Line2,
				Address3 = address.Line3,
				City = address.Municipality,
				Country = address.Country,
				State = address.StateOrProvince,
				PostalCode = address.PostalCode,
				
				Phone = "123-123-1234", 
			};
		}
		private async Task ensureRoleAsync(string roleName, string customerNumber, string description, string[] claims, CancellationToken cancellationToken)
		{
			await ensureRoleAsync(roleName, customerNumber, null, description, claims, cancellationToken);
		}
		private async Task ensureRoleAsync(string roleName, string customerNumber, string accountNumber, string description, string[] claims, CancellationToken cancellationToken)
		{
			if ((await securityManager.GetRoleByNameAsync(roleName, cancellationToken)) != null)
				return;

			var role = new ApplicationRole(roleName, customerNumber, accountNumber, description);

			var result = await this.securityManager.CreateRoleAsync(role, claims, cancellationToken);
			if (result.IsFailure)
				throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.SelectMany(((string entity, ICollection<string> errors) r) => r.errors.Select(e => $"{r.entity}: {e}"))) }");
		}
		private async Task ensureLookupAsync<T, K>(K id, T entity, CancellationToken cancellationToken) where T : class
		{
			var lookup = portalContext.Find<T>(id);
			if (lookup != null)
				return;


			portalContext.Add<T>(entity);
			var result = await portalContext.SaveAsync(cancellationToken);

			if (result.IsFailure)
				throw new Exception($"Seeding {id} of \"{typeof(T).Name}\" failed. Errors: {string.Join(Environment.NewLine, result.SelectMany(((string entity, ICollection<string> errors) r) => r.errors.Select(e => $"{r.entity}: {e}"))) }");
		}

		private async Task<ApplicationUser> ensureUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles, string accountNumber = null, CancellationToken cancellationToken = default(CancellationToken))
		{
			var user = await securityManager.GetUserByUserNameAsync(userName, cancellationToken);

			if (user != null)
				return user;


			user = new ApplicationUser
			{
				UserName = userName,
				LastName = fullName,
				Email = email,
				PhoneNumber = phoneNumber,
				EmailConfirmed = true,
				IsEnabled = true
			};

			var result = await securityManager.CreateUserAsync(user, roles, accountNumber ?? @"*", password, cancellationToken);
			if (result.IsFailure)
				throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.SelectMany(((string entity, ICollection<string> errors) r) => r.errors.Select(e => $"{r.entity}: {e}"))) }");


			return user;
		}
	}
}

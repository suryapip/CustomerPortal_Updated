using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using OpenIddict.EntityFrameworkCore.Models;
using ScentAir.Payment.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment.Impl
{
    public class PortalDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        private readonly ILogger logger;

        public ClaimsIdentity Identity { get; set; }
        public string UserInfo
        {
            get
            {
                var subject = Identity?.FindFirst("sub");  //OpenIdConnectConstants.Claims.Subject
                var name = subject?.Value ?? "System";

                return $"{name}";
            }
        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Account> Accounts { get; set; }

        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceDetail> InvoiceDetails { get; set; }
        public DbSet<InvoicePayment> InvoicePayments { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<IdentityQuestion> Questions { get; set; }
        public DbSet<InvoiceTax> InvoiceTaxes { get; set; }
        public DbSet<InvoiceHeaderExtension> InvoiceHeaderExtensions { get; set; }
        public DbSet<CompanyWireAchDetail> CompanyWireAchDetails { get; set; }




        public PortalDbContext(DbContextOptions<PortalDbContext> options, ILoggerFactory loggerFactory = null) : base(options)
        {
            logger = loggerFactory?.CreateLogger(Constants.Logging.Data.Portal);


            var principal = Thread.CurrentPrincipal as ClaimsPrincipal;
            this.Identity = principal?.Identity as ClaimsIdentity;
        }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var ob = builder.UseOpenIddict();

            ob.Entity<OpenIddictApplication>(entity => entity.ToTable($"{nameof(OpenIddictApplication)}"));
            ob.Entity<OpenIddictAuthorization>(entity => entity.ToTable($"{nameof(OpenIddictAuthorization)}"));
            ob.Entity<OpenIddictScope>(entity => entity.ToTable($"{nameof(OpenIddictScope)}"));
            ob.Entity<OpenIddictToken>(entity => entity.ToTable($"{nameof(OpenIddictToken)}"));


            builder.Entity<IdentityUserLogin<string>>(entity => entity.ToTable($"{nameof(this.UserLogins)}"));
            builder.Entity<IdentityUserToken<string>>(entity => entity.ToTable($"{nameof(this.UserTokens)}"));
            builder.Entity<IdentityUserClaim<string>>(entity => entity.ToTable($"{nameof(this.UserClaims)}"));
            builder.Entity<IdentityRoleClaim<string>>(entity => entity.ToTable($"{nameof(this.RoleClaims)}"));
            builder.Entity<IdentityUserRole<string>>(entity => entity.ToTable($"{nameof(this.UserRoles)}"));

            builder.Entity<IdentityQuestion>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Id).ValueGeneratedNever();

                entity.ToTable($"{nameof(this.Questions)}");
            });

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.HasIndex(x => new { x.UserName, x.Email, x.LastName, x.FirstName, x.MiddleName });
                entity.HasIndex(x => new { x.UserName, x.Email, x.LockoutEnabled, x.IsEnabled });

                entity.Property(x => x.A1).HasMaxLength(256).IsUnicode(true);
                entity.Property(x => x.A2).HasMaxLength(256).IsUnicode(true);

                entity.HasMany(u => u.Claims).WithOne().HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(u => u.Roles).WithOne().HasForeignKey(r => r.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(u => u.Question01).WithMany().HasForeignKey(u => u.Q1).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(u => u.Question02).WithMany().HasForeignKey(u => u.Q2).OnDelete(DeleteBehavior.Restrict);

                entity.ToTable($"{nameof(this.Users)}");
            });

            builder.Entity<ApplicationRole>(entity =>
            {
                entity.HasIndex(x => new { x.Id, x.CustomerNumber, x.AccountNumber });

                entity.HasMany(r => r.Claims).WithOne().HasForeignKey(x => x.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(r => r.Users).WithOne().HasForeignKey(r => r.RoleId).IsRequired().OnDelete(DeleteBehavior.Restrict);

                entity.ToTable($"{nameof(this.Roles)}");
            });

            builder.Entity<Address>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.HasIndex(x => new { x.PostalCode, x.Country, x.StateOrProvince, x.Municipality });

                entity.ToTable($"{nameof(this.Addresses)}");
            });

            builder.Entity<Company>(entity =>
            {
                entity.HasKey(x => x.Number);
                entity.HasIndex(x => x.Name).IsUnique();
                entity.HasIndex(x => new { x.Name, x.Email, x.PhoneNumber });
                entity.HasIndex(x => x.ExternalRowVersion);

                entity.Property(x => x.PhoneNumber).IsUnicode(false);
                entity.Property(x => x.FaxNumber).IsUnicode(false);

                entity.Property(x => x.Currency).HasMaxLength(10);


                entity.HasOne(x => x.PhysicalAddress).WithMany();
                entity.HasOne(x => x.BillingAddress).WithMany();
                entity.HasOne(x => x.ShippingAddress).WithMany();
                entity.HasOne(x => x.MailingAddress).WithMany();

                entity.HasMany(x => x.Users).WithOne();
                entity.HasMany(x => x.Accounts).WithOne();

                entity.ToTable($"{nameof(this.Companies)}");
            });

            builder.Entity<Account>(entity =>
            {
                entity.HasKey(x => x.Number);
                entity.HasIndex(x => new { x.Name, x.Email, x.PhoneNumber });
                entity.HasIndex(x => x.ExternalRowVersion);

                entity.Property(x => x.PhoneNumber).IsUnicode(false);
                entity.Property(x => x.FaxNumber).IsUnicode(false);


                entity.HasOne(x => x.PhysicalAddress).WithMany();
                entity.HasOne(x => x.BillingAddress).WithMany();
                entity.HasOne(x => x.ShippingAddress).WithMany();
                entity.HasOne(x => x.MailingAddress).WithMany();

                entity.HasMany(x => x.InvoicesAsReceiver).WithOne(x => x.SoldToAccount).HasForeignKey(x => x.SoldToAccountNumber).OnDelete(DeleteBehavior.Restrict);
                entity.HasMany(x => x.InvoicesAsPayor).WithOne(x => x.BilledToAccount).HasForeignKey(x => x.BilledToAccountNumber).OnDelete(DeleteBehavior.Restrict);
                entity.HasMany(x => x.PaymentMethods).WithOne(x => x.Account).HasForeignKey(x => x.AccountNumber).OnDelete(DeleteBehavior.Restrict);

                entity.ToTable($"{nameof(this.Accounts)}");
            });


            builder.Entity<PaymentMethod>(entity =>
            {
                entity.HasKey(x => new { x.Id });
                //entity.HasIndex(x => new { x.AccountNumber, x.PaymentAccountNumber }).IsUnique();
                entity.HasIndex(x => new { x.AccountNumber, x.Token }).IsUnique();

                entity.Property(x => x.Id).ValueGeneratedOnAdd().HasValueGenerator<GuidValueGenerator>();
                entity.Property(x => x.Name).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Token).HasMaxLength(1024);
                entity.Property(x => x.TokenSource).HasMaxLength(256);

                entity.Property(x => x.Bank).HasMaxLength(60);
                entity.Property(x => x.Branch).HasMaxLength(60);
                entity.Property(x => x.Currency).HasMaxLength(3).IsUnicode(false);
                entity.Property(x => x.PaymentBillToName).HasMaxLength(100);
                entity.Property(x => x.PaymentAccountNumber).HasMaxLength(32).IsUnicode(false).IsRequired();
                entity.Property(x => x.PaymentRoutingNumber).HasMaxLength(9).IsUnicode(false);
                entity.Property(x => x.PaymentType).IsRequired();
                entity.Property(x => x.CCV).HasMaxLength(6).IsUnicode(false);

                entity.Property(x => x.IsDefault).IsRequired();
                entity.Property(x => x.IsDeleted).IsRequired();
                entity.Property(x => x.IsDisabled).IsRequired();
                entity.Property(x => x.IsAuto).IsRequired();

                entity.HasOne(x => x.PaymentBillingAddress).WithMany().IsRequired().OnDelete(DeleteBehavior.Restrict);

                entity.ToTable($"{nameof(this.PaymentMethods)}");
            });


            builder.Entity<Invoice>(entity =>
            {
                entity.HasKey(x => x.InvoiceNumber);
                entity.HasIndex(x => new { x.BilledToAccountNumber, x.SoldToAccountNumber, x.Balance });
                entity.HasIndex(x => x.ExternalRowVersion);
                entity.HasIndex(x => x.ExternalRowVersion1);


                entity.HasOne(x => x.BillingEntity).WithMany();
                entity.HasOne(x => x.SoldToAccount).WithMany(x => x.InvoicesAsReceiver).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(x => x.BilledToAccount).WithMany(x => x.InvoicesAsPayor).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(x => x.ShippingAddress).WithMany();

                entity.HasMany(x => x.Details).WithOne(x => x.Invoice).HasForeignKey(d => d.InvoiceNumber).OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(x => x.Payments).WithOne(x => x.Invoice).HasForeignKey(p => p.InvoiceNumber).OnDelete(DeleteBehavior.Restrict);

                entity.ToTable($"{nameof(this.Invoices)}");
            });

            builder.Entity<InvoiceDetail>(entity =>
            {
                entity.HasKey(x => new
                {
                    x.InvoiceNumber,
                    x.LineNumber
                });
                entity.HasIndex(x => x.ExternalRowVersion);

                entity.ToTable($"{nameof(this.InvoiceDetails)}");
            });

            builder.Entity<InvoicePayment>(entity =>
            {
                entity.HasKey(x => x.TransactionNumber);
                entity.HasIndex(x => new { x.InvoiceNumber, x.TransactionNumber, x.ConfirmationNumber }).IsUnique();
                entity.HasIndex(x => new { x.Status, x.DateScheduled, x.DateAuthorized, x.DateFinalized });


                entity.Property(x => x.Amount).IsRequired();
                entity.Property(x => x.TransactionAmount).IsRequired();
                entity.Property(x => x.TransactionNumber).HasColumnName("ReferenceNumber").HasMaxLength(100).IsUnicode(false).IsRequired();
                entity.Property(x => x.ConfirmationNumber).HasMaxLength(100).IsUnicode(false);
                entity.Property(x => x.CheckNumber).HasMaxLength(8).IsUnicode(false);
                entity.Property(x => x.ProcessorStatus).HasMaxLength(100).IsUnicode(false);
                entity.Property(x => x.ApprovalStatus).HasMaxLength(100).IsUnicode(false);

                entity.HasOne(x => x.Invoice).WithMany(x => x.Payments).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(x => x.PaymentMethod).WithMany().OnDelete(DeleteBehavior.Restrict);

                entity.ToTable($"{nameof(this.InvoicePayments)}");
            });

            builder.Entity<InvoiceTax>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
                entity.Property(x => x.InvoiceNumber).IsRequired();
                entity.Property(x => x.TaxAmount).IsRequired();
                entity.Property(x => x.TaxDesc).IsRequired();
                entity.Property(x => x.BPR).IsRequired();

                entity.ToTable($"{nameof(this.InvoiceTaxes)}");
            });


            builder.Entity<InvoiceHeaderExtension>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
                entity.Property(x => x.InvoiceNumber).IsRequired();
                entity.HasIndex(x => new { x.InvoiceNumber }).IsUnique();


                entity.ToTable($"{nameof(this.InvoiceHeaderExtensions)}");
            });


            builder.Entity<InvoiceHeaderExtension>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
                entity.Property(x => x.InvoiceNumber).IsRequired();
                entity.HasIndex(x => new { x.InvoiceNumber }).IsUnique();
                
                entity.ToTable($"{nameof(this.InvoiceHeaderExtensions)}");
            });


            builder.Entity<CompanyWireAchDetail>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
                entity.Property(x => x.InvoiceNumber).IsRequired();
                entity.HasIndex(x => new { x.InvoiceNumber }).IsUnique();

                entity.ToTable($"{nameof(this.CompanyWireAchDetails)}");
            });

        }





        public ITaskResult<int> Save()
        {
            return SafeExtensions.Invoke(SaveChanges, logger, "Save");
        }
        public ITaskResult<int> Save(bool acceptAllChangesOnSuccess)
        {
            return SafeExtensions.Invoke(() => SaveChanges(acceptAllChangesOnSuccess), logger, $"SaveChanges({acceptAllChangesOnSuccess})");
        }
        public async Task<ITaskResult<int>> SaveAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            return await SaveChangesAsync(cancellationToken).InvokeAsync(logger, "SaveAsync");
        }
        public async Task<ITaskResult<int>> SaveAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken).InvokeAsync(logger, $"SaveAsync({acceptAllChangesOnSuccess})");
        }



        public override int SaveChanges()
        {
            updateAuditEntities();
            return base.SaveChanges();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            updateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            updateAuditEntities();
            return await base.SaveChangesAsync(cancellationToken);
        }
        public async override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            updateAuditEntities();
            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }


        private void updateAuditEntities()
        {
            var modifiedEntries = ChangeTracker
                .Entries()
                .Where(x => x.Entity is IAuditableEntity)
                .Where(x => x.State == EntityState.Added || x.State == EntityState.Modified);

            //.Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                var now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedOn = now;
                    entity.CreatedBy = UserInfo;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedOn).IsModified = false;

                    entity.ModifiedOn = now;
                    entity.ModifiedBy = UserInfo;
                }

            }
        }
    }
}

﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ScentAir.Payment.Impl;

namespace ScentAir.Payment.Migrations
{
    [DbContext(typeof(PortalDbContext))]
    [Migration("20181017023854_005")]
    partial class _005
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.3-rtm-32065")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("RoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("UserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("UserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("UserTokens");
                });

            modelBuilder.Entity("OpenIddict.EntityFrameworkCore.Models.OpenIddictApplication", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClientId")
                        .IsRequired();

                    b.Property<string>("ClientSecret");

                    b.Property<string>("ConcurrencyToken")
                        .IsConcurrencyToken();

                    b.Property<string>("ConsentType");

                    b.Property<string>("DisplayName");

                    b.Property<string>("Permissions");

                    b.Property<string>("PostLogoutRedirectUris");

                    b.Property<string>("Properties");

                    b.Property<string>("RedirectUris");

                    b.Property<string>("Type")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ClientId")
                        .IsUnique();

                    b.ToTable("OpenIddictApplication");
                });

            modelBuilder.Entity("OpenIddict.EntityFrameworkCore.Models.OpenIddictAuthorization", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationId");

                    b.Property<string>("ConcurrencyToken")
                        .IsConcurrencyToken();

                    b.Property<string>("Properties");

                    b.Property<string>("Scopes");

                    b.Property<string>("Status")
                        .IsRequired();

                    b.Property<string>("Subject")
                        .IsRequired();

                    b.Property<string>("Type")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.ToTable("OpenIddictAuthorization");
                });

            modelBuilder.Entity("OpenIddict.EntityFrameworkCore.Models.OpenIddictScope", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyToken")
                        .IsConcurrencyToken();

                    b.Property<string>("Description");

                    b.Property<string>("DisplayName");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Properties");

                    b.Property<string>("Resources");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("OpenIddictScope");
                });

            modelBuilder.Entity("OpenIddict.EntityFrameworkCore.Models.OpenIddictToken", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationId");

                    b.Property<string>("AuthorizationId");

                    b.Property<string>("ConcurrencyToken")
                        .IsConcurrencyToken();

                    b.Property<DateTimeOffset?>("CreationDate");

                    b.Property<DateTimeOffset?>("ExpirationDate");

                    b.Property<string>("Payload");

                    b.Property<string>("Properties");

                    b.Property<string>("ReferenceId");

                    b.Property<string>("Status");

                    b.Property<string>("Subject")
                        .IsRequired();

                    b.Property<string>("Type")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.HasIndex("AuthorizationId");

                    b.HasIndex("ReferenceId")
                        .IsUnique()
                        .HasFilter("[ReferenceId] IS NOT NULL");

                    b.ToTable("OpenIddictToken");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.Account", b =>
                {
                    b.Property<string>("Number")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(15);

                    b.Property<string>("AccountRepresentative")
                        .HasMaxLength(50);

                    b.Property<Guid?>("BillingAddressId");

                    b.Property<string>("CompanyNumber");

                    b.Property<string>("CompanyNumber1");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<string>("Currency")
                        .HasMaxLength(3);

                    b.Property<string>("Email")
                        .HasMaxLength(100);

                    b.Property<byte[]>("ExternalRowVersion")
                        .HasColumnType("binary(12)");

                    b.Property<string>("FaxNumber")
                        .HasMaxLength(84)
                        .IsUnicode(false);

                    b.Property<Guid?>("MailingAddressId");

                    b.Property<string>("ModifiedBy")
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(84)
                        .IsUnicode(false);

                    b.Property<Guid?>("PhysicalAddressId");

                    b.Property<string>("Pin")
                        .HasMaxLength(15);

                    b.Property<string>("SalesPerson")
                        .HasMaxLength(50);

                    b.Property<Guid?>("ShippingAddressId");

                    b.HasKey("Number");

                    b.HasIndex("BillingAddressId");

                    b.HasIndex("CompanyNumber");

                    b.HasIndex("CompanyNumber1");

                    b.HasIndex("ExternalRowVersion");

                    b.HasIndex("MailingAddressId");

                    b.HasIndex("PhysicalAddressId");

                    b.HasIndex("ShippingAddressId");

                    b.HasIndex("Name", "Email", "PhoneNumber");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.Address", b =>
                {
                    b.Property<Guid>("Id");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasMaxLength(40);

                    b.Property<string>("Line1")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("Line2")
                        .HasMaxLength(50);

                    b.Property<string>("Line3")
                        .HasMaxLength(50);

                    b.Property<string>("Municipality")
                        .IsRequired()
                        .HasMaxLength(40);

                    b.Property<string>("PostalCode")
                        .IsRequired()
                        .HasMaxLength(10);

                    b.Property<string>("StateOrProvince")
                        .IsRequired()
                        .HasMaxLength(35);

                    b.HasKey("Id");

                    b.HasIndex("PostalCode", "Country", "StateOrProvince", "Municipality");

                    b.ToTable("Addresses");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.ApplicationRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AccountNumber");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<string>("CustomerNumber");

                    b.Property<string>("Description");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.HasIndex("Id", "CustomerNumber", "AccountNumber");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("A1")
                        .HasMaxLength(256)
                        .IsUnicode(true);

                    b.Property<string>("A2")
                        .HasMaxLength(256)
                        .IsUnicode(true);

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("Accredidations");

                    b.Property<string>("CompanyNumber");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Configuration");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FirstName");

                    b.Property<bool>("IsEnabled");

                    b.Property<string>("LastName");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("MiddleName");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("Prefix");

                    b.Property<int?>("Q1");

                    b.Property<int?>("Q2");

                    b.Property<string>("Salutation");

                    b.Property<string>("SecurityStamp");

                    b.Property<string>("Suffix");

                    b.Property<string>("Title");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("CompanyNumber");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.HasIndex("Q1");

                    b.HasIndex("Q2");

                    b.HasIndex("UserName", "Email", "LockoutEnabled", "IsEnabled");

                    b.HasIndex("UserName", "Email", "LastName", "FirstName", "MiddleName");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.Company", b =>
                {
                    b.Property<string>("Number")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(15);

                    b.Property<Guid?>("BillingAddressId");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<string>("Currency")
                        .HasMaxLength(10);

                    b.Property<string>("Email")
                        .HasMaxLength(100);

                    b.Property<byte[]>("ExternalRowVersion")
                        .HasColumnType("binary(12)");

                    b.Property<string>("FaxNumber")
                        .HasMaxLength(84)
                        .IsUnicode(false);

                    b.Property<Guid?>("MailingAddressId");

                    b.Property<string>("ModifiedBy")
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(84)
                        .IsUnicode(false);

                    b.Property<Guid?>("PhysicalAddressId");

                    b.Property<Guid?>("ShippingAddressId");

                    b.Property<string>("WireAccountNumber")
                        .HasMaxLength(20);

                    b.Property<string>("WireBank")
                        .HasMaxLength(60);

                    b.Property<string>("WireBranch")
                        .HasMaxLength(60);

                    b.Property<string>("WireName")
                        .HasMaxLength(60);

                    b.Property<string>("WireRoutingNumber")
                        .HasMaxLength(9);

                    b.HasKey("Number");

                    b.HasIndex("BillingAddressId");

                    b.HasIndex("ExternalRowVersion");

                    b.HasIndex("MailingAddressId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.HasIndex("PhysicalAddressId");

                    b.HasIndex("ShippingAddressId");

                    b.HasIndex("Name", "Email", "PhoneNumber");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.IdentityQuestion", b =>
                {
                    b.Property<int>("Id");

                    b.Property<int>("Order");

                    b.Property<string>("Question");

                    b.HasKey("Id");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.Invoice", b =>
                {
                    b.Property<string>("InvoiceNumber")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(20);

                    b.Property<decimal>("Balance");

                    b.Property<string>("BalanceCurrency")
                        .HasMaxLength(3);

                    b.Property<string>("BilledToAccountNumber")
                        .HasMaxLength(15);

                    b.Property<string>("BillingEntityNumber");

                    b.Property<string>("Comments")
                        .HasColumnType("ntext");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<string>("Currency")
                        .HasMaxLength(3);

                    b.Property<string>("CustomerPurchaseOrderNumber")
                        .HasMaxLength(30);

                    b.Property<string>("CustomerReferenceNumber")
                        .HasMaxLength(40);

                    b.Property<DateTimeOffset?>("DateDue");

                    b.Property<decimal>("DiscountAmount");

                    b.Property<byte[]>("ExternalRowVersion")
                        .HasColumnType("binary(12)");

                    b.Property<string>("IncoTerms")
                        .HasMaxLength(80);

                    b.Property<DateTimeOffset>("InvoiceDate");

                    b.Property<string>("ModifiedBy")
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<string>("PaymentTerms")
                        .HasMaxLength(80);

                    b.Property<string>("SellingEntityNumber");

                    b.Property<DateTimeOffset?>("ServiceFrom");

                    b.Property<DateTimeOffset?>("ServiceTo");

                    b.Property<Guid?>("ShippingAddressId");

                    b.Property<string>("ShippingMethod")
                        .HasMaxLength(60);

                    b.Property<string>("ShippingNumber")
                        .HasMaxLength(60);

                    b.Property<string>("ShippingResult")
                        .HasMaxLength(60);

                    b.Property<string>("SoldToAccountNumber")
                        .HasMaxLength(15);

                    b.Property<decimal>("SubTotalAmount");

                    b.Property<decimal>("TaxAmount");

                    b.Property<string>("TaxId")
                        .HasMaxLength(20);

                    b.Property<decimal>("TaxRate");

                    b.Property<decimal>("Total");

                    b.HasKey("InvoiceNumber");

                    b.HasIndex("BillingEntityNumber");

                    b.HasIndex("ExternalRowVersion");

                    b.HasIndex("SellingEntityNumber");

                    b.HasIndex("ShippingAddressId");

                    b.HasIndex("SoldToAccountNumber");

                    b.HasIndex("BilledToAccountNumber", "SoldToAccountNumber", "Balance");

                    b.ToTable("Invoices");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.InvoiceDetail", b =>
                {
                    b.Property<string>("InvoiceNumber")
                        .HasMaxLength(20);

                    b.Property<int>("LineNumber");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<string>("Description")
                        .HasMaxLength(30);

                    b.Property<decimal>("Discount");

                    b.Property<byte[]>("ExternalRowVersion")
                        .HasColumnType("binary(12)");

                    b.Property<decimal>("ExtraAmount");

                    b.Property<string>("Item")
                        .HasMaxLength(20);

                    b.Property<string>("ModifiedBy")
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<decimal>("Quantity");

                    b.Property<decimal>("UnitDiscount");

                    b.Property<decimal>("UnitPrice");

                    b.HasKey("InvoiceNumber", "LineNumber");

                    b.HasIndex("ExternalRowVersion");

                    b.ToTable("InvoiceDetails");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.InvoicePayment", b =>
                {
                    b.Property<string>("ReferenceNumber")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<decimal>("Amount");

                    b.Property<string>("ApprovalStatus")
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<string>("CheckNumber")
                        .HasMaxLength(8)
                        .IsUnicode(false);

                    b.Property<string>("ConfirmationNumber")
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<DateTimeOffset?>("DateAuthorized");

                    b.Property<DateTimeOffset?>("DateFinalized");

                    b.Property<DateTimeOffset?>("DateScheduled");

                    b.Property<string>("InvoiceNumber")
                        .IsRequired()
                        .HasMaxLength(20);

                    b.Property<string>("ModifiedBy")
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<Guid?>("PaymentMethodId");

                    b.Property<string>("PaymentMethodName");

                    b.Property<string>("ProcessorStatus")
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<byte[]>("RowVersion")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate();

                    b.Property<int>("Status");

                    b.Property<decimal>("TransactionAmount");

                    b.HasKey("ReferenceNumber");

                    b.HasIndex("PaymentMethodId", "PaymentMethodName");

                    b.HasIndex("InvoiceNumber", "ReferenceNumber", "ConfirmationNumber")
                        .IsUnique()
                        .HasFilter("[ConfirmationNumber] IS NOT NULL");

                    b.HasIndex("Status", "DateScheduled", "DateAuthorized", "DateFinalized");

                    b.ToTable("InvoicePayments");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.PaymentMethod", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .HasMaxLength(50);

                    b.Property<string>("AccountNumber")
                        .IsRequired()
                        .HasMaxLength(15);

                    b.Property<string>("Bank")
                        .HasMaxLength(60);

                    b.Property<string>("Branch")
                        .HasMaxLength(60);

                    b.Property<string>("CCV")
                        .HasMaxLength(6)
                        .IsUnicode(false);

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset>("CreatedOn");

                    b.Property<string>("Currency")
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.Property<DateTimeOffset?>("ExpiresOn");

                    b.Property<bool>("IsAuto");

                    b.Property<bool>("IsDefault");

                    b.Property<bool>("IsDeleted");

                    b.Property<bool>("IsDisabled");

                    b.Property<string>("ModifiedBy")
                        .HasMaxLength(256);

                    b.Property<DateTimeOffset?>("ModifiedOn");

                    b.Property<string>("PaymentAccountNumber")
                        .IsRequired()
                        .HasMaxLength(32)
                        .IsUnicode(false);

                    b.Property<string>("PaymentBillToName")
                        .HasMaxLength(100);

                    b.Property<string>("PaymentRoutingNumber")
                        .HasMaxLength(9)
                        .IsUnicode(false);

                    b.Property<int>("PaymentType");

                    b.Property<string>("Token")
                        .HasMaxLength(1024);

                    b.Property<string>("TokenSource")
                        .HasMaxLength(256);

                    b.HasKey("Id", "Name");

                    b.HasIndex("AccountNumber", "PaymentAccountNumber")
                        .IsUnique();

                    b.HasIndex("AccountNumber", "Token")
                        .IsUnique()
                        .HasFilter("[Token] IS NOT NULL");

                    b.ToTable("PaymentMethods");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.ApplicationRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.ApplicationUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.ApplicationRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("ScentAir.Payment.Models.ApplicationUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OpenIddict.EntityFrameworkCore.Models.OpenIddictAuthorization", b =>
                {
                    b.HasOne("OpenIddict.EntityFrameworkCore.Models.OpenIddictApplication", "Application")
                        .WithMany("Authorizations")
                        .HasForeignKey("ApplicationId");
                });

            modelBuilder.Entity("OpenIddict.EntityFrameworkCore.Models.OpenIddictToken", b =>
                {
                    b.HasOne("OpenIddict.EntityFrameworkCore.Models.OpenIddictApplication", "Application")
                        .WithMany("Tokens")
                        .HasForeignKey("ApplicationId");

                    b.HasOne("OpenIddict.EntityFrameworkCore.Models.OpenIddictAuthorization", "Authorization")
                        .WithMany("Tokens")
                        .HasForeignKey("AuthorizationId");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.Account", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.Address", "BillingAddress")
                        .WithMany()
                        .HasForeignKey("BillingAddressId");

                    b.HasOne("ScentAir.Payment.Models.Company")
                        .WithMany("Accounts")
                        .HasForeignKey("CompanyNumber");

                    b.HasOne("ScentAir.Payment.Models.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyNumber1");

                    b.HasOne("ScentAir.Payment.Models.Address", "MailingAddress")
                        .WithMany()
                        .HasForeignKey("MailingAddressId");

                    b.HasOne("ScentAir.Payment.Models.Address", "PhysicalAddress")
                        .WithMany()
                        .HasForeignKey("PhysicalAddressId");

                    b.HasOne("ScentAir.Payment.Models.Address", "ShippingAddress")
                        .WithMany()
                        .HasForeignKey("ShippingAddressId");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.ApplicationUser", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.Company")
                        .WithMany("Users")
                        .HasForeignKey("CompanyNumber");

                    b.HasOne("ScentAir.Payment.Models.IdentityQuestion", "Question01")
                        .WithMany()
                        .HasForeignKey("Q1")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("ScentAir.Payment.Models.IdentityQuestion", "Question02")
                        .WithMany()
                        .HasForeignKey("Q2")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("ScentAir.Payment.Models.Company", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.Address", "BillingAddress")
                        .WithMany()
                        .HasForeignKey("BillingAddressId");

                    b.HasOne("ScentAir.Payment.Models.Address", "MailingAddress")
                        .WithMany()
                        .HasForeignKey("MailingAddressId");

                    b.HasOne("ScentAir.Payment.Models.Address", "PhysicalAddress")
                        .WithMany()
                        .HasForeignKey("PhysicalAddressId");

                    b.HasOne("ScentAir.Payment.Models.Address", "ShippingAddress")
                        .WithMany()
                        .HasForeignKey("ShippingAddressId");
                });

            modelBuilder.Entity("ScentAir.Payment.Models.Invoice", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.Account", "BilledToAccount")
                        .WithMany("InvoicesAsPayor")
                        .HasForeignKey("BilledToAccountNumber")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("ScentAir.Payment.Models.Company", "BillingEntity")
                        .WithMany()
                        .HasForeignKey("BillingEntityNumber");

                    b.HasOne("ScentAir.Payment.Models.Company", "SellingEntity")
                        .WithMany()
                        .HasForeignKey("SellingEntityNumber");

                    b.HasOne("ScentAir.Payment.Models.Address", "ShippingAddress")
                        .WithMany()
                        .HasForeignKey("ShippingAddressId");

                    b.HasOne("ScentAir.Payment.Models.Account", "SoldToAccount")
                        .WithMany("InvoicesAsReceiver")
                        .HasForeignKey("SoldToAccountNumber")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("ScentAir.Payment.Models.InvoiceDetail", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.Invoice", "Invoice")
                        .WithMany("Details")
                        .HasForeignKey("InvoiceNumber")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ScentAir.Payment.Models.InvoicePayment", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.Invoice", "Invoice")
                        .WithMany("Payments")
                        .HasForeignKey("InvoiceNumber")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("ScentAir.Payment.Models.PaymentMethod", "PaymentMethod")
                        .WithMany()
                        .HasForeignKey("PaymentMethodId", "PaymentMethodName")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("ScentAir.Payment.Models.PaymentMethod", b =>
                {
                    b.HasOne("ScentAir.Payment.Models.Account", "Account")
                        .WithMany("PaymentMethods")
                        .HasForeignKey("AccountNumber")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("ScentAir.Payment.Models.Address", "PaymentBillingAddress")
                        .WithMany()
                        .HasForeignKey("Id")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}

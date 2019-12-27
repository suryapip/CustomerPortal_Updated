using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _001 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Line1 = table.Column<string>(maxLength: 50, nullable: false),
                    Line2 = table.Column<string>(maxLength: 50, nullable: true),
                    Line3 = table.Column<string>(maxLength: 50, nullable: true),
                    Municipality = table.Column<string>(maxLength: 40, nullable: false),
                    StateOrProvince = table.Column<string>(maxLength: 35, nullable: false),
                    PostalCode = table.Column<string>(maxLength: 10, nullable: false),
                    Country = table.Column<string>(maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictApplication",
                columns: table => new
                {
                    ClientId = table.Column<string>(nullable: false),
                    ClientSecret = table.Column<string>(nullable: true),
                    ConcurrencyToken = table.Column<string>(nullable: true),
                    ConsentType = table.Column<string>(nullable: true),
                    DisplayName = table.Column<string>(nullable: true),
                    Id = table.Column<string>(nullable: false),
                    Permissions = table.Column<string>(nullable: true),
                    PostLogoutRedirectUris = table.Column<string>(nullable: true),
                    Properties = table.Column<string>(nullable: true),
                    RedirectUris = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictApplication", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictScope",
                columns: table => new
                {
                    ConcurrencyToken = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    DisplayName = table.Column<string>(nullable: true),
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Properties = table.Column<string>(nullable: true),
                    Resources = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictScope", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    CustomerNumber = table.Column<string>(nullable: true),
                    AccountNumber = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    Number = table.Column<string>(maxLength: 15, nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Email = table.Column<string>(maxLength: 100, nullable: true),
                    PhoneNumber = table.Column<string>(unicode: false, maxLength: 84, nullable: true),
                    FaxNumber = table.Column<string>(unicode: false, maxLength: 84, nullable: true),
                    WireName = table.Column<string>(maxLength: 60, nullable: true),
                    WireBank = table.Column<string>(maxLength: 60, nullable: true),
                    WireBranch = table.Column<string>(maxLength: 60, nullable: true),
                    WireAccountNumber = table.Column<string>(maxLength: 20, nullable: true),
                    WireRoutingNumber = table.Column<string>(maxLength: 9, nullable: true),
                    Currency = table.Column<string>(maxLength: 10, nullable: true),
                    PhysicalAddressId = table.Column<Guid>(nullable: true),
                    MailingAddressId = table.Column<Guid>(nullable: true),
                    BillingAddressId = table.Column<Guid>(nullable: true),
                    ShippingAddressId = table.Column<Guid>(nullable: true),
                    ExternalRowVersion = table.Column<byte[]>(type: "binary(12)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Number);
                    table.ForeignKey(
                        name: "FK_Companies_Addresses_BillingAddressId",
                        column: x => x.BillingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Companies_Addresses_MailingAddressId",
                        column: x => x.MailingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Companies_Addresses_PhysicalAddressId",
                        column: x => x.PhysicalAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Companies_Addresses_ShippingAddressId",
                        column: x => x.ShippingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictAuthorization",
                columns: table => new
                {
                    ApplicationId = table.Column<string>(nullable: true),
                    ConcurrencyToken = table.Column<string>(nullable: true),
                    Id = table.Column<string>(nullable: false),
                    Properties = table.Column<string>(nullable: true),
                    Scopes = table.Column<string>(nullable: true),
                    Status = table.Column<string>(nullable: false),
                    Subject = table.Column<string>(nullable: false),
                    Type = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictAuthorization", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OpenIddictAuthorization_OpenIddictApplication_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "OpenIddictApplication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    Number = table.Column<string>(maxLength: 15, nullable: false),
                    Pin = table.Column<string>(maxLength: 15, nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Email = table.Column<string>(maxLength: 100, nullable: true),
                    PhoneNumber = table.Column<string>(unicode: false, maxLength: 84, nullable: true),
                    FaxNumber = table.Column<string>(unicode: false, maxLength: 84, nullable: true),
                    Currency = table.Column<string>(maxLength: 3, nullable: true),
                    PhysicalAddressId = table.Column<Guid>(nullable: true),
                    MailingAddressId = table.Column<Guid>(nullable: true),
                    BillingAddressId = table.Column<Guid>(nullable: true),
                    ShippingAddressId = table.Column<Guid>(nullable: true),
                    SalesPerson = table.Column<string>(maxLength: 50, nullable: true),
                    AccountRepresentative = table.Column<string>(maxLength: 50, nullable: true),
                    ExternalRowVersion = table.Column<byte[]>(type: "binary(12)", nullable: true),
                    CompanyNumber1 = table.Column<string>(nullable: true),
                    CompanyNumber = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Number);
                    table.ForeignKey(
                        name: "FK_Accounts_Addresses_BillingAddressId",
                        column: x => x.BillingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Accounts_Companies_CompanyNumber",
                        column: x => x.CompanyNumber,
                        principalTable: "Companies",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Accounts_Companies_CompanyNumber1",
                        column: x => x.CompanyNumber1,
                        principalTable: "Companies",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Accounts_Addresses_MailingAddressId",
                        column: x => x.MailingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Accounts_Addresses_PhysicalAddressId",
                        column: x => x.PhysicalAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Accounts_Addresses_ShippingAddressId",
                        column: x => x.ShippingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    Salutation = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Prefix = table.Column<string>(nullable: true),
                    FirstName = table.Column<string>(nullable: true),
                    MiddleName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Suffix = table.Column<string>(nullable: true),
                    Accredidations = table.Column<string>(nullable: true),
                    Configuration = table.Column<string>(nullable: true),
                    IsEnabled = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    CompanyNumber = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Companies_CompanyNumber",
                        column: x => x.CompanyNumber,
                        principalTable: "Companies",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictToken",
                columns: table => new
                {
                    ApplicationId = table.Column<string>(nullable: true),
                    AuthorizationId = table.Column<string>(nullable: true),
                    ConcurrencyToken = table.Column<string>(nullable: true),
                    CreationDate = table.Column<DateTimeOffset>(nullable: true),
                    ExpirationDate = table.Column<DateTimeOffset>(nullable: true),
                    Id = table.Column<string>(nullable: false),
                    Payload = table.Column<string>(nullable: true),
                    Properties = table.Column<string>(nullable: true),
                    ReferenceId = table.Column<string>(nullable: true),
                    Status = table.Column<string>(nullable: true),
                    Subject = table.Column<string>(nullable: false),
                    Type = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OpenIddictToken_OpenIddictApplication_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "OpenIddictApplication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OpenIddictToken_OpenIddictAuthorization_AuthorizationId",
                        column: x => x.AuthorizationId,
                        principalTable: "OpenIddictAuthorization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    SoldToAccountNumber = table.Column<string>(maxLength: 15, nullable: true),
                    BilledToAccountNumber = table.Column<string>(maxLength: 15, nullable: true),
                    BillingEntityNumber = table.Column<string>(nullable: true),
                    ExternalRowVersion = table.Column<byte[]>(type: "binary(12)", nullable: true),
                    InvoiceNumber = table.Column<string>(maxLength: 20, nullable: false),
                    InvoiceDate = table.Column<DateTimeOffset>(nullable: false),
                    CustomerReferenceNumber = table.Column<string>(maxLength: 40, nullable: true),
                    CustomerPurchaseOrderNumber = table.Column<string>(maxLength: 30, nullable: true),
                    ShippingAddressId = table.Column<Guid>(nullable: true),
                    ShippingNumber = table.Column<string>(maxLength: 60, nullable: true),
                    ShippingMethod = table.Column<string>(maxLength: 60, nullable: true),
                    ShippingResult = table.Column<string>(maxLength: 60, nullable: true),
                    ServiceFrom = table.Column<DateTimeOffset>(nullable: true),
                    ServiceTo = table.Column<DateTimeOffset>(nullable: true),
                    IncoTerms = table.Column<string>(maxLength: 80, nullable: true),
                    PaymentTerms = table.Column<string>(maxLength: 80, nullable: true),
                    Comments = table.Column<string>(type: "ntext", nullable: true),
                    TaxId = table.Column<string>(maxLength: 20, nullable: true),
                    Currency = table.Column<string>(maxLength: 3, nullable: true),
                    DiscountAmount = table.Column<decimal>(nullable: false),
                    Total = table.Column<decimal>(nullable: false),
                    SubTotalAmount = table.Column<decimal>(nullable: false),
                    TaxRate = table.Column<decimal>(nullable: false),
                    TaxAmount = table.Column<decimal>(nullable: false),
                    Balance = table.Column<decimal>(nullable: false),
                    BalanceCurrency = table.Column<string>(maxLength: 3, nullable: true),
                    DateDue = table.Column<DateTimeOffset>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.InvoiceNumber);
                    table.ForeignKey(
                        name: "FK_Invoices_Accounts_BilledToAccountNumber",
                        column: x => x.BilledToAccountNumber,
                        principalTable: "Accounts",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Invoices_Companies_BillingEntityNumber",
                        column: x => x.BillingEntityNumber,
                        principalTable: "Companies",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Invoices_Addresses_ShippingAddressId",
                        column: x => x.ShippingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Invoices_Accounts_SoldToAccountNumber",
                        column: x => x.SoldToAccountNumber,
                        principalTable: "Accounts",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentMethods",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PaymentType = table.Column<int>(nullable: false),
                    AccountNumber = table.Column<string>(maxLength: 15, nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    PaymentAccountNumber = table.Column<string>(maxLength: 32, nullable: false),
                    PaymentRoutingNumber = table.Column<string>(maxLength: 9, nullable: true),
                    Bank = table.Column<string>(maxLength: 60, nullable: true),
                    Branch = table.Column<string>(maxLength: 60, nullable: true),
                    Currency = table.Column<string>(maxLength: 3, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentMethods", x => new { x.AccountNumber, x.Name });
                    table.ForeignKey(
                        name: "FK_PaymentMethods_Accounts_AccountNumber",
                        column: x => x.AccountNumber,
                        principalTable: "Accounts",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceDetails",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    InvoiceNumber = table.Column<string>(maxLength: 20, nullable: false),
                    LineNumber = table.Column<int>(nullable: false),
                    Item = table.Column<string>(maxLength: 20, nullable: true),
                    Description = table.Column<string>(maxLength: 30, nullable: true),
                    UnitPrice = table.Column<decimal>(nullable: false),
                    UnitDiscount = table.Column<decimal>(nullable: false),
                    Quantity = table.Column<decimal>(nullable: false),
                    Discount = table.Column<decimal>(nullable: false),
                    ExtraAmount = table.Column<decimal>(nullable: false),
                    ExternalRowVersion = table.Column<byte[]>(type: "binary(12)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceDetails", x => new { x.InvoiceNumber, x.LineNumber });
                    table.ForeignKey(
                        name: "FK_InvoiceDetails_Invoices_InvoiceNumber",
                        column: x => x.InvoiceNumber,
                        principalTable: "Invoices",
                        principalColumn: "InvoiceNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoicePayments",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    InvoiceNumber = table.Column<string>(maxLength: 20, nullable: false),
                    Amount = table.Column<decimal>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    CheckNumber = table.Column<string>(maxLength: 8, nullable: true),
                    ReferenceNumber = table.Column<string>(maxLength: 100, nullable: false),
                    Result = table.Column<string>(maxLength: 100, nullable: true),
                    DateAuthorized = table.Column<DateTimeOffset>(nullable: true),
                    DateScheduled = table.Column<DateTimeOffset>(nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoicePayments", x => new { x.InvoiceNumber, x.ReferenceNumber, x.CreatedOn, x.Status });
                    table.UniqueConstraint("AK_InvoicePayments_ReferenceNumber", x => x.ReferenceNumber);
                    table.ForeignKey(
                        name: "FK_InvoicePayments_Invoices_InvoiceNumber",
                        column: x => x.InvoiceNumber,
                        principalTable: "Invoices",
                        principalColumn: "InvoiceNumber",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_BillingAddressId",
                table: "Accounts",
                column: "BillingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_CompanyNumber",
                table: "Accounts",
                column: "CompanyNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_CompanyNumber1",
                table: "Accounts",
                column: "CompanyNumber1");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_ExternalRowVersion",
                table: "Accounts",
                column: "ExternalRowVersion");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_MailingAddressId",
                table: "Accounts",
                column: "MailingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_PhysicalAddressId",
                table: "Accounts",
                column: "PhysicalAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_ShippingAddressId",
                table: "Accounts",
                column: "ShippingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Name_Email_PhoneNumber",
                table: "Accounts",
                columns: new[] { "Name", "Email", "PhoneNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_PostalCode_Country_StateOrProvince_Municipality",
                table: "Addresses",
                columns: new[] { "PostalCode", "Country", "StateOrProvince", "Municipality" });

            migrationBuilder.CreateIndex(
                name: "IX_Companies_BillingAddressId",
                table: "Companies",
                column: "BillingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ExternalRowVersion",
                table: "Companies",
                column: "ExternalRowVersion");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_MailingAddressId",
                table: "Companies",
                column: "MailingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_Name",
                table: "Companies",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Companies_PhysicalAddressId",
                table: "Companies",
                column: "PhysicalAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ShippingAddressId",
                table: "Companies",
                column: "ShippingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_Name_Email_PhoneNumber",
                table: "Companies",
                columns: new[] { "Name", "Email", "PhoneNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceDetails_ExternalRowVersion",
                table: "InvoiceDetails",
                column: "ExternalRowVersion");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_DateScheduled",
                table: "InvoicePayments",
                column: "DateScheduled");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_ReferenceNumber_CreatedOn_Status_Result",
                table: "InvoicePayments",
                columns: new[] { "ReferenceNumber", "CreatedOn", "Status", "Result" },
                unique: true,
                filter: "[Result] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_BillingEntityNumber",
                table: "Invoices",
                column: "BillingEntityNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_ExternalRowVersion",
                table: "Invoices",
                column: "ExternalRowVersion");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_ShippingAddressId",
                table: "Invoices",
                column: "ShippingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_SoldToAccountNumber",
                table: "Invoices",
                column: "SoldToAccountNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_BilledToAccountNumber_SoldToAccountNumber_Balance",
                table: "Invoices",
                columns: new[] { "BilledToAccountNumber", "SoldToAccountNumber", "Balance" });

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictApplication_ClientId",
                table: "OpenIddictApplication",
                column: "ClientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictAuthorization_ApplicationId",
                table: "OpenIddictAuthorization",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictScope_Name",
                table: "OpenIddictScope",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictToken_ApplicationId",
                table: "OpenIddictToken",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictToken_AuthorizationId",
                table: "OpenIddictToken",
                column: "AuthorizationId");

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictToken_ReferenceId",
                table: "OpenIddictToken",
                column: "ReferenceId",
                unique: true,
                filter: "[ReferenceId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_AccountNumber_PaymentAccountNumber",
                table: "PaymentMethods",
                columns: new[] { "AccountNumber", "PaymentAccountNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Id_CustomerNumber_AccountNumber",
                table: "Roles",
                columns: new[] { "Id", "CustomerNumber", "AccountNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CompanyNumber",
                table: "Users",
                column: "CompanyNumber");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName_Email_LockoutEnabled_IsEnabled",
                table: "Users",
                columns: new[] { "UserName", "Email", "LockoutEnabled", "IsEnabled" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName_Email_LastName_FirstName_MiddleName",
                table: "Users",
                columns: new[] { "UserName", "Email", "LastName", "FirstName", "MiddleName" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceDetails");

            migrationBuilder.DropTable(
                name: "InvoicePayments");

            migrationBuilder.DropTable(
                name: "OpenIddictScope");

            migrationBuilder.DropTable(
                name: "OpenIddictToken");

            migrationBuilder.DropTable(
                name: "PaymentMethods");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "OpenIddictAuthorization");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "OpenIddictApplication");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Addresses");
        }
    }
}

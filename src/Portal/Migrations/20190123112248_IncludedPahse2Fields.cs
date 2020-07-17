using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class IncludedPahse2Fields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "Accounts",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxPrefix",
                table: "Accounts",
                maxLength: 20,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CompanyWireAchDetails",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CompanyNumber = table.Column<string>(maxLength: 15, nullable: false),
                    WireBankId = table.Column<string>(maxLength: 60, nullable: true),
                    RemitSortcode = table.Column<string>(maxLength: 450, nullable: true),
                    RemitBan = table.Column<string>(maxLength: 450, nullable: true),
                    SwiftName = table.Column<string>(maxLength: 7, nullable: true),
                    Swift = table.Column<string>(maxLength: 18, nullable: true),
                    WireCurrency = table.Column<string>(maxLength: 450, nullable: true),
                    WireName2 = table.Column<string>(maxLength: 450, nullable: true),
                    WireBank2 = table.Column<string>(maxLength: 450, nullable: true),
                    WireAccount2 = table.Column<string>(maxLength: 30, nullable: true),
                    Swift2 = table.Column<string>(maxLength: 18, nullable: true),
                    WireCurrency2 = table.Column<string>(maxLength: 450, nullable: true),
                    ExternalRowVersion = table.Column<byte[]>(type: "binary(12)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyWireAchDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyWireAchDetails_Companies_CompanyNumber",
                        column: x => x.CompanyNumber,
                        principalTable: "Companies",
                        principalColumn: "Number",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceHeaderExtensions",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    InvoiceNumber = table.Column<string>(maxLength: 20, nullable: false),
                    TaxIdPrefix = table.Column<string>(maxLength: 20, nullable: true),
                    KvkNumber = table.Column<string>(maxLength: 20, nullable: true),
                    InvoiceCurrency = table.Column<string>(maxLength: 3, nullable: true),
                    Memo = table.Column<string>(nullable: true),
                    PdcrAmount = table.Column<string>(maxLength: 18, nullable: true),
                    PaymentReference = table.Column<string>(nullable: true),
                    CheckNumber = table.Column<string>(nullable: true),
                    PayAmount = table.Column<decimal>(nullable: false),
                    ImporteTOT = table.Column<string>(maxLength: 80, nullable: true),
                    PayByCustomer = table.Column<string>(maxLength: 15, nullable: true),
                    PayByName = table.Column<string>(maxLength: 35, nullable: true),
                    PayByAddressId = table.Column<Guid>(nullable: true),
                    ExternalRowVersion = table.Column<byte[]>(type: "binary(12)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceHeaderExtensions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceHeaderExtensions_Invoices_InvoiceNumber",
                        column: x => x.InvoiceNumber,
                        principalTable: "Invoices",
                        principalColumn: "InvoiceNumber",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceHeaderExtensions_Addresses_PayByAddressId",
                        column: x => x.PayByAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyWireAchDetails_CompanyNumber",
                table: "CompanyWireAchDetails",
                column: "CompanyNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceHeaderExtensions_InvoiceNumber",
                table: "InvoiceHeaderExtensions",
                column: "InvoiceNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceHeaderExtensions_PayByAddressId",
                table: "InvoiceHeaderExtensions",
                column: "PayByAddressId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyWireAchDetails");

            migrationBuilder.DropTable(
                name: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "TaxPrefix",
                table: "Accounts");
        }
    }
}

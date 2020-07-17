using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _007 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "PaymentBillingAddressId",
                table: "PaymentMethods",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "InvoiceTaxes",
                columns: table => new
                {
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: false),
                    ModifiedBy = table.Column<string>(maxLength: 256, nullable: true),
                    ModifiedOn = table.Column<DateTimeOffset>(nullable: true),
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    InvoiceNumber = table.Column<string>(maxLength: 20, nullable: false),
                    TaxAmount = table.Column<decimal>(nullable: false),
                    TaxDesc = table.Column<string>(nullable: false),
                    BPR = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceTaxes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceTaxes_Invoices_InvoiceNumber",
                        column: x => x.InvoiceNumber,
                        principalTable: "Invoices",
                        principalColumn: "InvoiceNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTaxes_InvoiceNumber",
                table: "InvoiceTaxes",
                column: "InvoiceNumber");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceTaxes");

            migrationBuilder.AlterColumn<Guid>(
                name: "PaymentBillingAddressId",
                table: "PaymentMethods",
                nullable: true,
                oldClrType: typeof(Guid));
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class IncludedPhase2DBFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KvkNumber",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "TaxIdPrefix",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.AddColumn<string>(
                name: "DocType",
                table: "InvoiceHeaderExtensions",
                maxLength: 11,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Logo",
                table: "InvoiceHeaderExtensions",
                maxLength: 2,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "KvkNumber",
                table: "Companies",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "Companies",
                maxLength: 400,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxIdPrefix",
                table: "Companies",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Accounts",
                maxLength: 3,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocType",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "Logo",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "KvkNumber",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "TaxIdPrefix",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Accounts");

            migrationBuilder.AddColumn<string>(
                name: "KvkNumber",
                table: "InvoiceHeaderExtensions",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxIdPrefix",
                table: "InvoiceHeaderExtensions",
                maxLength: 20,
                nullable: true);
        }
    }
}

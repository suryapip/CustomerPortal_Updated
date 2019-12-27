using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class WireAchInformationUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyWireAchDetails_Companies_CompanyNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropIndex(
                name: "IX_CompanyWireAchDetails_CompanyNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropColumn(
                name: "CompanyNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.AddColumn<string>(
                name: "InvoiceNumber",
                table: "CompanyWireAchDetails",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WireAccountNumber",
                table: "CompanyWireAchDetails",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WireBank",
                table: "CompanyWireAchDetails",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WireBranch",
                table: "CompanyWireAchDetails",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WireName",
                table: "CompanyWireAchDetails",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WireRoutingNumber",
                table: "CompanyWireAchDetails",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyWireAchDetails_InvoiceNumber",
                table: "CompanyWireAchDetails",
                column: "InvoiceNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyWireAchDetails_Invoices_InvoiceNumber",
                table: "CompanyWireAchDetails",
                column: "InvoiceNumber",
                principalTable: "Invoices",
                principalColumn: "InvoiceNumber",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyWireAchDetails_Invoices_InvoiceNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropIndex(
                name: "IX_CompanyWireAchDetails_InvoiceNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropColumn(
                name: "InvoiceNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropColumn(
                name: "WireAccountNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropColumn(
                name: "WireBank",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropColumn(
                name: "WireBranch",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropColumn(
                name: "WireName",
                table: "CompanyWireAchDetails");

            migrationBuilder.DropColumn(
                name: "WireRoutingNumber",
                table: "CompanyWireAchDetails");

            migrationBuilder.AddColumn<string>(
                name: "CompanyNumber",
                table: "CompanyWireAchDetails",
                maxLength: 15,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyWireAchDetails_CompanyNumber",
                table: "CompanyWireAchDetails",
                column: "CompanyNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyWireAchDetails_Companies_CompanyNumber",
                table: "CompanyWireAchDetails",
                column: "CompanyNumber",
                principalTable: "Companies",
                principalColumn: "Number",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

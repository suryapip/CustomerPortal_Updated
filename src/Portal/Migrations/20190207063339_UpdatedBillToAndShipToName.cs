using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class UpdatedBillToAndShipToName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BillToName",
                table: "InvoiceHeaderExtensions",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShipToName",
                table: "InvoiceHeaderExtensions",
                maxLength: 250,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillToName",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "ShipToName",
                table: "InvoiceHeaderExtensions");
        }
    }
}

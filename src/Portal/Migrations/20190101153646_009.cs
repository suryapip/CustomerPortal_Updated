using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _009 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAcceptedAutoTC",
                table: "PaymentMethods",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsAcceptedPayTC",
                table: "InvoicePayments",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAcceptedAutoTC",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "IsAcceptedPayTC",
                table: "InvoicePayments");
        }
    }
}

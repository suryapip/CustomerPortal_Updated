using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class IncludedCPYField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CPY",
                table: "InvoiceHeaderExtensions",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Municipality",
                table: "Addresses",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 40);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CPY",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.AlterColumn<string>(
                name: "Municipality",
                table: "Addresses",
                maxLength: 40,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100);
        }
    }
}

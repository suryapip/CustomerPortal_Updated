using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class IncludedPhase2DBFieldsInPortal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "PayAmount",
                table: "InvoiceHeaderExtensions",
                nullable: true,
                oldClrType: typeof(decimal));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "PayAmount",
                table: "InvoiceHeaderExtensions",
                nullable: false,
                oldClrType: typeof(double),
                oldNullable: true);
        }
    }
}

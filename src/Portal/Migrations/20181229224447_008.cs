using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _008 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_AccountNumber_PaymentAccountNumber",
                table: "PaymentMethods");

            migrationBuilder.AlterColumn<string>(
                name: "WireRoutingNumber",
                table: "Companies",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 9,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "WireAccountNumber",
                table: "Companies",
                maxLength: 40,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 20,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "WireRoutingNumber",
                table: "Companies",
                maxLength: 9,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "WireAccountNumber",
                table: "Companies",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 40,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_AccountNumber_PaymentAccountNumber",
                table: "PaymentMethods",
                columns: new[] { "AccountNumber", "PaymentAccountNumber" },
                unique: true);
        }
    }
}

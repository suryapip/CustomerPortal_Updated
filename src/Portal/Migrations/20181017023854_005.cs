using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _005 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Questions_Q1Id",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Questions_Q2Id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Q1Id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Q2Id",
                table: "Users");

            //migrationBuilder.DropColumn(
            //    name: "Q1Id",
            //    table: "Users");

            //migrationBuilder.DropColumn(
            //    name: "Q2Id",
            //    table: "Users");

            //migrationBuilder.AlterColumn<string>(
            //    name: "A2",
            //    table: "Users",
            //    maxLength: 256,
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldMaxLength: 256);

            //migrationBuilder.AlterColumn<string>(
            //    name: "A1",
            //    table: "Users",
            //    maxLength: 256,
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldMaxLength: 256);

            //migrationBuilder.AddColumn<int>(
            //    name: "Q1",
            //    table: "Users",
            //    nullable: true);

            //migrationBuilder.AddColumn<int>(
            //    name: "Q2",
            //    table: "Users",
            //    nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SellingEntityNumber",
                table: "Invoices",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Q1",
                table: "Users",
                column: "Q1");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Q2",
                table: "Users",
                column: "Q2");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_SellingEntityNumber",
                table: "Invoices",
                column: "SellingEntityNumber");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Companies_SellingEntityNumber",
                table: "Invoices",
                column: "SellingEntityNumber",
                principalTable: "Companies",
                principalColumn: "Number",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods",
                column: "Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Questions_Q1",
                table: "Users",
                column: "Q1",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Questions_Q2",
                table: "Users",
                column: "Q2",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Companies_SellingEntityNumber",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_Users_Questions_Q1",
            //    table: "Users");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_Users_Questions_Q2",
            //    table: "Users");

            //migrationBuilder.DropIndex(
            //    name: "IX_Users_Q1",
            //    table: "Users");

            //migrationBuilder.DropIndex(
            //    name: "IX_Users_Q2",
            //    table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_SellingEntityNumber",
                table: "Invoices");

            //migrationBuilder.DropColumn(
            //    name: "Q1",
            //    table: "Users");

            //migrationBuilder.DropColumn(
            //    name: "Q2",
            //    table: "Users");

            migrationBuilder.DropColumn(
                name: "SellingEntityNumber",
                table: "Invoices");

            //migrationBuilder.AlterColumn<string>(
            //    name: "A2",
            //    table: "Users",
            //    maxLength: 256,
            //    nullable: false,
            //    oldClrType: typeof(string),
            //    oldMaxLength: 256,
            //    oldNullable: true);

            //migrationBuilder.AlterColumn<string>(
            //    name: "A1",
            //    table: "Users",
            //    maxLength: 256,
            //    nullable: false,
            //    oldClrType: typeof(string),
            //    oldMaxLength: 256,
            //    oldNullable: true);

            //migrationBuilder.AddColumn<int>(
            //    name: "Q1Id",
            //    table: "Users",
            //    nullable: false,
            //    defaultValue: 0);

            //migrationBuilder.AddColumn<int>(
            //    name: "Q2Id",
            //    table: "Users",
            //    nullable: false,
            //    defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Q1Id",
                table: "Users",
                column: "Q1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Q2Id",
                table: "Users",
                column: "Q2Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods",
                column: "Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Questions_Q1Id",
                table: "Users",
                column: "Q1Id",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Questions_Q2Id",
                table: "Users",
                column: "Q2Id",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

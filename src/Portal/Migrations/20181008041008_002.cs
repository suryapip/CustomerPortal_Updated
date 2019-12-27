using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _002 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "PaymentMethods",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedOn",
                table: "PaymentMethods",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "PaymentMethods",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PaymentMethods",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisabled",
                table: "PaymentMethods",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "PaymentMethods",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ModifiedOn",
                table: "PaymentMethods",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentBillToName",
                table: "PaymentMethods",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileToken",
                table: "PaymentMethods",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods",
                columns: new[] { "Id", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_AccountNumber_ProfileToken",
                table: "PaymentMethods",
                columns: new[] { "AccountNumber", "ProfileToken" },
                unique: true,
                filter: "[ProfileToken] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods",
                column: "Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_AccountNumber_ProfileToken",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "IsDisabled",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "ModifiedOn",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "PaymentBillToName",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "ProfileToken",
                table: "PaymentMethods");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods",
                columns: new[] { "AccountNumber", "Name" });
        }
    }
}

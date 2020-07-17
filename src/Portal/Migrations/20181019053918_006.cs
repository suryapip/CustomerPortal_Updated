using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _006 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoicePayments_PaymentMethods_PaymentMethodId_PaymentMethodName",
                table: "InvoicePayments");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_InvoicePayments_PaymentMethodId_PaymentMethodName",
                table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "PaymentMethodName",
                table: "InvoicePayments");

            migrationBuilder.AddColumn<Guid>(
                name: "PaymentBillingAddressId",
                table: "PaymentMethods",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_PaymentBillingAddressId",
                table: "PaymentMethods",
                column: "PaymentBillingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_PaymentMethodId",
                table: "InvoicePayments",
                column: "PaymentMethodId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoicePayments_PaymentMethods_PaymentMethodId",
                table: "InvoicePayments",
                column: "PaymentMethodId",
                principalTable: "PaymentMethods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentMethods_Addresses_PaymentBillingAddressId",
                table: "PaymentMethods",
                column: "PaymentBillingAddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoicePayments_PaymentMethods_PaymentMethodId",
                table: "InvoicePayments");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentMethods_Addresses_PaymentBillingAddressId",
                table: "PaymentMethods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_PaymentBillingAddressId",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_InvoicePayments_PaymentMethodId",
                table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "PaymentBillingAddressId",
                table: "PaymentMethods");

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethodName",
                table: "InvoicePayments",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentMethods",
                table: "PaymentMethods",
                columns: new[] { "Id", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_PaymentMethodId_PaymentMethodName",
                table: "InvoicePayments",
                columns: new[] { "PaymentMethodId", "PaymentMethodName" });

            migrationBuilder.AddForeignKey(
                name: "FK_InvoicePayments_PaymentMethods_PaymentMethodId_PaymentMethodName",
                table: "InvoicePayments",
                columns: new[] { "PaymentMethodId", "PaymentMethodName" },
                principalTable: "PaymentMethods",
                principalColumns: new[] { "Id", "Name" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods",
                column: "Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

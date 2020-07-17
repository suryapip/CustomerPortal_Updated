using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class UpdateBilltoAndShipAddresses : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BillToAddressId",
                table: "InvoiceHeaderExtensions",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustTaxId",
                table: "InvoiceHeaderExtensions",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustTaxPrefix",
                table: "InvoiceHeaderExtensions",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ShipToAddressId",
                table: "InvoiceHeaderExtensions",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceHeaderExtensions_BillToAddressId",
                table: "InvoiceHeaderExtensions",
                column: "BillToAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceHeaderExtensions_ShipToAddressId",
                table: "InvoiceHeaderExtensions",
                column: "ShipToAddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceHeaderExtensions_Addresses_BillToAddressId",
                table: "InvoiceHeaderExtensions",
                column: "BillToAddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceHeaderExtensions_Addresses_ShipToAddressId",
                table: "InvoiceHeaderExtensions",
                column: "ShipToAddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceHeaderExtensions_Addresses_BillToAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceHeaderExtensions_Addresses_ShipToAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceHeaderExtensions_BillToAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceHeaderExtensions_ShipToAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "BillToAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "CustTaxId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "CustTaxPrefix",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "ShipToAddressId",
                table: "InvoiceHeaderExtensions");
        }
    }
}

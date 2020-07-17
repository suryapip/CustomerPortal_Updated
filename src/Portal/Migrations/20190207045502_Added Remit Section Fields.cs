using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class AddedRemitSectionFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RemitAddressId",
                table: "InvoiceHeaderExtensions",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RemitCurrency",
                table: "InvoiceHeaderExtensions",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RemitName",
                table: "InvoiceHeaderExtensions",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WireClearing",
                table: "CompanyWireAchDetails",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceHeaderExtensions_RemitAddressId",
                table: "InvoiceHeaderExtensions",
                column: "RemitAddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceHeaderExtensions_Addresses_RemitAddressId",
                table: "InvoiceHeaderExtensions",
                column: "RemitAddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceHeaderExtensions_Addresses_RemitAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceHeaderExtensions_RemitAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "RemitAddressId",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "RemitCurrency",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "RemitName",
                table: "InvoiceHeaderExtensions");

            migrationBuilder.DropColumn(
                name: "WireClearing",
                table: "CompanyWireAchDetails");
        }
    }
}

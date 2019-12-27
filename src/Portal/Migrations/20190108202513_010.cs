using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _010 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ExternalRowVersion1",
                table: "Invoices",
                type: "binary(8)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_ExternalRowVersion1",
                table: "Invoices",
                column: "ExternalRowVersion1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Invoices_ExternalRowVersion1",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "ExternalRowVersion1",
                table: "Invoices");
        }
    }
}

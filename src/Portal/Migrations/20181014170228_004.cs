using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _004 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_AccountNumber_ProfileToken",
                table: "PaymentMethods");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_InvoicePayments_ReferenceNumber",
                table: "InvoicePayments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InvoicePayments",
                table: "InvoicePayments");

            migrationBuilder.DropIndex(
                name: "IX_InvoicePayments_DateScheduled",
                table: "InvoicePayments");

            migrationBuilder.DropIndex(
                name: "IX_InvoicePayments_ReferenceNumber_CreatedOn_Status_Result",
                table: "InvoicePayments");

            //migrationBuilder.DropColumn(
            //    name: "Result",
            //    table: "InvoicePayments");
            migrationBuilder.RenameColumn(
                name: "Result",
                table: "InvoicePayments", 
                newName: "ConfirmationNumber");            

            migrationBuilder.RenameColumn(
                name: "ProfileToken",
                table: "PaymentMethods",
                newName: "TokenSource");

            migrationBuilder.AlterColumn<string>(
                name: "PaymentRoutingNumber",
                table: "PaymentMethods",
                unicode: false,
                maxLength: 9,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 9,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentAccountNumber",
                table: "PaymentMethods",
                unicode: false,
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Currency",
                table: "PaymentMethods",
                unicode: false,
                maxLength: 3,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 3,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CCV",
                table: "PaymentMethods",
                unicode: false,
                maxLength: 6,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ExpiresOn",
                table: "PaymentMethods",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAuto",
                table: "PaymentMethods",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "PaymentMethods",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CheckNumber",
                table: "InvoicePayments",
                unicode: false,
                maxLength: 8,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 8,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReferenceNumber",
                table: "InvoicePayments",
                unicode: false,
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "ApprovalStatus",
                table: "InvoicePayments",
                unicode: false,
                maxLength: 100,
                nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "ConfirmationNumber",
            //    table: "InvoicePayments",
            //    unicode: false,
            //    maxLength: 100,
            //    nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DateFinalized",
                table: "InvoicePayments",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PaymentMethodId",
                table: "InvoicePayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethodName",
                table: "InvoicePayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProcessorStatus",
                table: "InvoicePayments",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TransactionAmount",
                table: "InvoicePayments",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddPrimaryKey(
                name: "PK_InvoicePayments",
                table: "InvoicePayments",
                column: "ReferenceNumber");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_AccountNumber_Token",
                table: "PaymentMethods",
                columns: new[] { "AccountNumber", "Token" },
                unique: true,
                filter: "[Token] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_PaymentMethodId_PaymentMethodName",
                table: "InvoicePayments",
                columns: new[] { "PaymentMethodId", "PaymentMethodName" });

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_InvoiceNumber_ReferenceNumber_ConfirmationNumber",
                table: "InvoicePayments",
                columns: new[] { "InvoiceNumber", "ReferenceNumber", "ConfirmationNumber" },
                unique: true,
                filter: "[ConfirmationNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_Status_DateScheduled_DateAuthorized_DateFinalized",
                table: "InvoicePayments",
                columns: new[] { "Status", "DateScheduled", "DateAuthorized", "DateFinalized" });

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoicePayments_PaymentMethods_PaymentMethodId_PaymentMethodName",
                table: "InvoicePayments");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_AccountNumber_Token",
                table: "PaymentMethods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InvoicePayments",
                table: "InvoicePayments");

            migrationBuilder.DropIndex(
                name: "IX_InvoicePayments_PaymentMethodId_PaymentMethodName",
                table: "InvoicePayments");

            migrationBuilder.DropIndex(
                name: "IX_InvoicePayments_InvoiceNumber_ReferenceNumber_ConfirmationNumber",
                table: "InvoicePayments");

            migrationBuilder.DropIndex(
                name: "IX_InvoicePayments_Status_DateScheduled_DateAuthorized_DateFinalized",
                table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "CCV",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "ExpiresOn",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "IsAuto",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "Token",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "InvoicePayments");

            //migrationBuilder.DropColumn(
            //    name: "ConfirmationNumber",
            //    table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "DateFinalized",
                table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "PaymentMethodId",
                table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "PaymentMethodName",
                table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "ProcessorStatus",
                table: "InvoicePayments");

            migrationBuilder.DropColumn(
                name: "TransactionAmount",
                table: "InvoicePayments");

            migrationBuilder.RenameColumn(
                name: "TokenSource",
                table: "PaymentMethods",
                newName: "ProfileToken");

            migrationBuilder.AlterColumn<string>(
                name: "PaymentRoutingNumber",
                table: "PaymentMethods",
                maxLength: 9,
                nullable: true,
                oldClrType: typeof(string),
                oldUnicode: false,
                oldMaxLength: 9,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentAccountNumber",
                table: "PaymentMethods",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldUnicode: false,
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Currency",
                table: "PaymentMethods",
                maxLength: 3,
                nullable: true,
                oldClrType: typeof(string),
                oldUnicode: false,
                oldMaxLength: 3,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CheckNumber",
                table: "InvoicePayments",
                maxLength: 8,
                nullable: true,
                oldClrType: typeof(string),
                oldUnicode: false,
                oldMaxLength: 8,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReferenceNumber",
                table: "InvoicePayments",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldUnicode: false,
                oldMaxLength: 100);

            //migrationBuilder.AddColumn<string>(
            //    name: "Result",
            //    table: "InvoicePayments",
            //    maxLength: 100,
            //    nullable: true);
            migrationBuilder.RenameColumn(
                newName: "Result",
                table: "InvoicePayments",
                name: "ConfirmationNumber");


            migrationBuilder.AddUniqueConstraint(
                name: "AK_InvoicePayments_ReferenceNumber",
                table: "InvoicePayments",
                column: "ReferenceNumber");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InvoicePayments",
                table: "InvoicePayments",
                columns: new[] { "InvoiceNumber", "ReferenceNumber", "CreatedOn", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_AccountNumber_ProfileToken",
                table: "PaymentMethods",
                columns: new[] { "AccountNumber", "ProfileToken" },
                unique: true,
                filter: "[ProfileToken] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_DateScheduled",
                table: "InvoicePayments",
                column: "DateScheduled");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayments_ReferenceNumber_CreatedOn_Status_Result",
                table: "InvoicePayments",
                columns: new[] { "ReferenceNumber", "CreatedOn", "Status", "Result" },
                unique: true,
                filter: "[Result] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentMethods_Addresses_Id",
                table: "PaymentMethods",
                column: "Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

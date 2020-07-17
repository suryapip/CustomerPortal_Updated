using Microsoft.EntityFrameworkCore.Migrations;

namespace ScentAir.Payment.Migrations
{
    public partial class _003 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "A1",
                table: "Users",
                maxLength: 256,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "A2",
                table: "Users",
                maxLength: 256,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Q1",
                table: "Users",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Q2",
                table: "Users",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Question = table.Column<string>(nullable: true),
                    Order = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Q1Id",
                table: "Users",
                column: "Q1");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Q2Id",
                table: "Users",
                column: "Q2");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Questions_Q1Id",
                table: "Users",
                column: "Q1",
                principalTable: "Questions",
                principalColumn: "Id", 
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Questions_Q2Id",
                table: "Users",
                column: "Q2",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Questions_Q1",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Questions_Q2Id",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Users_Q1Id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Q2Id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "A1",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "A2",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Q1",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Q2",
                table: "Users");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grupp3_app.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPrivacySettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowAge",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowCity",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowGender",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowAge",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShowCity",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShowGender",
                table: "Users");
        }
    }
}

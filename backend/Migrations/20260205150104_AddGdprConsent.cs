using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grupp3_app.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddGdprConsent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AcceptedPrivacy",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AcceptedTerms",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ConsentDate",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptedPrivacy",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AcceptedTerms",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ConsentDate",
                table: "Users");
        }
    }
}

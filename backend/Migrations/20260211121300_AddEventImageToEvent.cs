using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grupp3_app.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddEventImageToEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "EventImageData",
                table: "Events",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventImageFileType",
                table: "Events",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventImageData",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EventImageFileType",
                table: "Events");
        }
    }
}

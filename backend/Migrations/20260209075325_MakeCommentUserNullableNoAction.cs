using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grupp3_app.Api.Migrations
{
    /// <inheritdoc />
    public partial class MakeCommentUserNullableNoAction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventComments_Users_UserId",
                table: "EventComments");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "EventComments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_EventComments_Users_UserId",
                table: "EventComments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventComments_Users_UserId",
                table: "EventComments");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "EventComments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EventComments_Users_UserId",
                table: "EventComments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

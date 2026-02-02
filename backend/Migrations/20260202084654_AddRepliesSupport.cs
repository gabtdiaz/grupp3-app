using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grupp3_app.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRepliesSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentCommentId",
                table: "EventComments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventComments_ParentCommentId",
                table: "EventComments",
                column: "ParentCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventComments_EventComments_ParentCommentId",
                table: "EventComments",
                column: "ParentCommentId",
                principalTable: "EventComments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventComments_EventComments_ParentCommentId",
                table: "EventComments");

            migrationBuilder.DropIndex(
                name: "IX_EventComments_ParentCommentId",
                table: "EventComments");

            migrationBuilder.DropColumn(
                name: "ParentCommentId",
                table: "EventComments");
        }
    }
}

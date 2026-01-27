using System.ComponentModel.DataAnnotations;

namespace grupp3_app.Api.DTOs.Comment;

public class CreateCommentDto
{
    [Required(ErrorMessage = "Comment content is required")]
    [MinLength(1, ErrorMessage = "Comment cannot be empty")]
    [MaxLength(500, ErrorMessage = "Comment cannot exceed 500 characters")]
    public required string Content { get; set; }
}
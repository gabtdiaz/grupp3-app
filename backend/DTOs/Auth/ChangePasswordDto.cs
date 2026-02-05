using System.ComponentModel.DataAnnotations;
using grupp3_app.Api.Validation;

namespace grupp3_app.Api.DTOs.Auth;

public class ChangePasswordDto
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [StrongPassword]
    public string NewPassword { get; set; } = string.Empty;
}

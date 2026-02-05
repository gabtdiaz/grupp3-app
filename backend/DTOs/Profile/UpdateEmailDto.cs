using System.ComponentModel.DataAnnotations;

namespace grupp3_app.Api.DTOs.Profile;

public class UpdateEmailDto
{
	[Required]
	[EmailAddress(ErrorMessage = "Invalid email address")]
	public string Email { get; set; } = string.Empty;
}

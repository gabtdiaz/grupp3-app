using System.ComponentModel.DataAnnotations;
using grupp3_app.Api.Models;

namespace grupp3_app.Api.DTOs.Profile;

public class UpdateProfileDto
{
    [Required(ErrorMessage = "First name is required")]
    [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "City is required")]
    public string City { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Bio cannot exceed 500 characters")]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Interests cannot exceed 500 characters")]
    public string Interests { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; } = string.Empty;

    public bool ShowGender { get; set; }
    public bool ShowAge { get; set; }
    public bool ShowCity { get; set; }
}
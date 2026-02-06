using grupp3_app.Api.Models;

namespace grupp3_app.Api.DTOs.Profile;

public class ProfileDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string Bio { get; set; } = string.Empty;
    public string Interests { get; set; } = string.Empty;
    public bool ShowGender { get; set; }
    public bool ShowAge { get; set; }
    public bool ShowCity { get; set; }
    public DateTime CreatedAt { get; set; }
}
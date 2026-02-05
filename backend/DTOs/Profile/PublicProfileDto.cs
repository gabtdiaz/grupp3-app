using grupp3_app.Api.Models;

namespace grupp3_app.Api.DTOs.Profile;

public class PublicProfileDto
{
    public int Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string? Gender { get; set; } = string.Empty;
    public string? City { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string Bio { get; set; } = string.Empty;
    public string Interests { get; set; } = string.Empty;
}
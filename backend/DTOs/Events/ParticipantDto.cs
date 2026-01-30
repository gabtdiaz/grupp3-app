namespace grupp3_app.Api.DTOs.Events;

public class ParticipantDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
}
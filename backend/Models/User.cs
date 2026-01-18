namespace grupp3_app.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // Navigation properties
    // public UserProfile? UserProfile { get; set; }
    // public ICollection<Event> CreatedEvents { get; set; } = new List<Event>();
    // public ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();
    // public ICollection<EventComment> Comments { get; set; } = new List<EventComment>();
}
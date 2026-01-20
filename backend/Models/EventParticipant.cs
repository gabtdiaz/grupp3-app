namespace grupp3_app.Api.Models;

public class EventParticipant
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EventId { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public ParticipantStatus Status { get; set; } = ParticipantStatus.Confirmed;

    // Navigation properties
    public User User { get; set; } = null!;
    public User Event { get; set; } = null!;
}

public enum ParticipantStatus
{
    Confirmed = 1, //
    Cancelled = 2 //Lämnat (sparas i historik?)
}
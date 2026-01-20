namespace grupp3_app.Api.Models;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartDateTime { get; set; } 
    public DateTime? EndDateTime { get; set; }
    public int MaxParticipants { get; set; } 
    public string? ImageUrl { get; set; } 
    public EventCategory Category { get; set; }
    public bool IsActive { get; set; } = true;

    // Restiktioner
    public GenderRestriction GenderRestriction { get; set; } = GenderRestriction.All;
    public int? MinimumAge { get; set; }  // null = ingen åldersgräns
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // FK
    public int CreatedByUserId { get; set; }
    
    // Navigation Properties
    public User CreatedBy { get; set; } = null!;
    public ICollection<EventParticipant> Participants { get; set; } = new List<EventParticipant>();
    public ICollection<EventComment> Comments { get; set; } = new List<EventComment>();
}

public enum EventCategory
{
    Sport = 1,
    Social = 2,
    Kultur = 3,
    MatochDryck = 4,
    Utomhus = 5,
    Gaming = 6,
    Musik = 7,
    Studier = 8,
    Övrigt = 9
    }

    public enum GenderRestriction
    {
        All = 0,
        OnlyMen = 1,
        OnlyWomen = 2
    }


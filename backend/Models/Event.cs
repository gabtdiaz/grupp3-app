namespace grupp3_app.Api.Models;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartDateTime { get; set; } 
    public DateTime? EndDateTime { get; set; }
    public string? ImageUrl { get; set; } 

    public bool IsActive { get; set; } = true;

    // Restiktioner
    public int MaxParticipants { get; set; } 
    public GenderRestriction GenderRestriction { get; set; } = GenderRestriction.All;
    public int? MinimumAge { get; set; }  // null = ingen åldersgräns
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // FK
    public int CreatedByUserId { get; set; }
    public int CategoryId { get; set; }  
    
    // Navigation Properties
    public User CreatedBy { get; set; } = null!;
    public Category Category { get; set; } = null!;  // Navigation property

    public ICollection<EventParticipant> Participants { get; set; } = new List<EventParticipant>();
    public ICollection<EventComment> Comments { get; set; } = new List<EventComment>();
}

    public enum GenderRestriction
    {
        All = 1,
        OnlyMen = 2,
        OnlyWomen = 3
    }


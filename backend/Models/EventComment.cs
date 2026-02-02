namespace grupp3_app.Api.Models;

public class EventComment
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } //Ska man kunna redigera kommentar?

    // FK

    public int UserId { get; set; }
    public int EventId { get; set; }
    public int? ParentCommentId { get; set; } 

    // Navigation properties
    public User User { get; set; } = null!;
    public Event Event { get; set; } = null!; 
    public EventComment? ParentComment { get; set; } 
    public ICollection<EventComment> Replies { get; set; } = new List<EventComment>();
    
}


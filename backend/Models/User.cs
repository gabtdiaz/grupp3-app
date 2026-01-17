namespace grupp3_app.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    public string FirstName { get; set ; } = string.Empty;
    public string LastName { get; set ; } = string.Empty; 

    public DateTime DateOfBirth { get; set; }

    public Gender Gender { get; set; }
    public string City { get; set; } = string.Empty;

     public string? ProfileImageUrl { get; set; }  // Optional, default bild om null

     public string Bio {get; set;} = string.Empty;

    public string Interests { get; set; } = string.Empty;  // Lista med valda intressen

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }


    // Navigation properties
//    public ICollection<Event> CreatedEvents { get; set; } = new List<Event>();
//     public ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();
//     public ICollection<EventComment> Comments { get; set; } = new List<EventComment>();
}

public enum Gender
{
    Man = 0,
    Kvinna = 1,
    Annat = 2,
    VillInteUppge = 3,
}
namespace grupp3_app.Api.DTOs.Events;

public class EventDto
{
    public int Id { get; set; } //eventets ID
    public string Title { get; set; } = string.Empty; //titel på eventet
    public string? Description { get; set; } //beskrivning
    public string Location { get; set; } = string.Empty; //plats
    public DateTime StartDateTime { get; set; } //starttid
    public DateTime? EndDateTime { get; set; } //sluttid
    public string? ImageUrl { get; set; } //bild
    public int CategoryId { get; set; }  // För filtrering/sökning
    public string Category { get; set; } = string.Empty;  // DisplayName: "RÖRELSE"
    public string GenderRestriction { get; set; } = string.Empty; //könsrestriktion, enum/string
    public int MaxParticipants { get; set; } //max antal deltagare
    public int? MinimumAge { get; set; } //minimiålder
    public int CurrentParticipants { get; set; }  // Antal deltagare - NY   
    public bool IsActive { get; set; } //om eventet är aktivt
    public int CreatedByUserId { get; set; } 
    public string? CreatedByProfileImageUrl { get; set; } // Arrangörens profilbild
    public string CreatedBy { get; set; } = string.Empty; //namn på skaparen
    public DateTime CreatedAt { get; set; } //datun när den är skapad
    public bool IsFull => MaxParticipants > 0 && CurrentParticipants >= MaxParticipants; 

    public List<ParticipantDto> Participants { get; set; } = new List<ParticipantDto>();
    public bool IsUserParticipating { get; set; }
}

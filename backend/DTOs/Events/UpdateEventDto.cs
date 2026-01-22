namespace grupp3_app.Api.DTOs.Events;

public class UpdateEventDto
{
    public string Title { get; set; } = string.Empty; //titel på eventet
    public string? Description { get; set; } //beskrivning
    public string Location { get; set; } = string.Empty; //plats
    public DateTime StartDateTime { get; set; } //starttid
    public DateTime? EndDateTime { get; set; } //slutttid
    public string? ImageUrl { get; set; } //bild
    public string Category { get; set; } = string.Empty; //kategori
    public int MaxParticipants { get; set; } //max antal deltagare
    public string GenderRestriction { get; set; } = string.Empty; //könsrestriktion
    public int? MinimumAge { get; set; } //minimiålder
}

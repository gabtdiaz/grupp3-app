using System.ComponentModel.DataAnnotations;
using grupp3_app.Api.Validation;

namespace grupp3_app.Api.DTOs.Events;

public class UpdateEventDto
{
    [Required(ErrorMessage = "Title is required")]
    [MinLength(3, ErrorMessage = "Title must be at least 3 characters")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = string.Empty; // titel på eventet

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; } // beskrivning, valfri

    [Required(ErrorMessage = "Location is required")]
    [MinLength(2, ErrorMessage = "Location must be at least 2 characters")]
    public string Location { get; set; } = string.Empty; // plats

    [Required(ErrorMessage = "Start date and time is required")]
    public DateTime StartDateTime { get; set; } // starttid

    [EndDateTimeAfterStart(ErrorMessage = "End date must be after start date")]
    public DateTime? EndDateTime { get; set; } // sluttid, valfri

    public string? ImageUrl { get; set; } // bild, valfri

    [Required(ErrorMessage = "Category is required")]
    public string Category { get; set; } = string.Empty; // kategori (enum som string)

    [Range(2, 1000, ErrorMessage = "Maximum participants must be between 2 and 1000")]
    public int MaxParticipants { get; set; } // max antal deltagare

    [Required(ErrorMessage = "Gender restriction is required")]
    public string GenderRestriction { get; set; } = string.Empty; // könsrestriktion (enum som string)

    [Range(18, 100, ErrorMessage = "Minimum age must be between 18 and 100")]
    public int? MinimumAge { get; set; } // minimiålder, valfri
}

using System.ComponentModel.DataAnnotations;
using grupp3_app.Api.Models;
using grupp3_app.Api.Validation;

namespace grupp3_app.Api.DTOs.Event;

public class CreateEventDto
{
    [Required(ErrorMessage = "Title is required")]
    [MinLength(3, ErrorMessage = "Title must be at least 3 characters")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Location is required")]
    [MinLength(2, ErrorMessage = "Location must be at least 2 characters")]
    public string Location { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Start date and time is required")]
    public DateTime StartDateTime { get; set; }
    
    [EndDateTimeAfterStart]
    public DateTime? EndDateTime { get; set; }
    public string? ImageUrl { get; set; }
    
    [Required(ErrorMessage = "Category is required")]
    public EventCategory Category { get; set; }
    
    [Range(2, 1000, ErrorMessage = "Maximum participants must be between 2 and 1000")]
    public int MaxParticipants { get; set; }
    public GenderRestriction GenderRestriction { get; set; } = GenderRestriction.All;

    [Range(18, 100, ErrorMessage = "Minimum age must be between 18 and 100")]
    public int? MinimumAge { get; set; }
}
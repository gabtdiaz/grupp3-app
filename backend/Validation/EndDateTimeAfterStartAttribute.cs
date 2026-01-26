using System.ComponentModel.DataAnnotations;

namespace grupp3_app.Api.Validation;

public class EndDateTimeAfterStartAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return ValidationResult.Success;
        }

        // Fetch CreateEventDto
        var dto = validationContext.ObjectInstance;
        
        // Fetch StartDateTime
        var startDateProperty = dto.GetType().GetProperty("StartDateTime");
        if (startDateProperty == null)
        {
            return new ValidationResult("StartDateTime property not found");
        }

        var startDateTime = (DateTime?)startDateProperty.GetValue(dto);
        var endDateTime = (DateTime?)value;

        // Check if EndDateTime is after StartDateTime
        if (endDateTime <= startDateTime)
        {
            return new ValidationResult("End date and time must be after start date and time");
        }

        return ValidationResult.Success;
    }
}
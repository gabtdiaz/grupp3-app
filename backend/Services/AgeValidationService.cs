namespace grupp3_app.Api.Services;

/// Service för åldersvalidering och beräkning

public class AgeValidationService
{
    /// Beräknar ålder från födelsedatum
    public int CalculateAge(DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Year;

        // Om födelsedag inte har varit än i år, minska med 1
        if (dateOfBirth.Date > today.AddYears(-age))
        {
            age--;
        }

        return age;
    }

    /// Validerar att användaren är minst 18 år (för registrering)
    public bool IsAtLeast18YearsOld(DateTime dateOfBirth)
    {
        return CalculateAge(dateOfBirth) >= 18;
    }

    /// Validerar att användaren uppfyller minimiålder (för att visa event)
    public bool IsAtLeastAge(DateTime dateOfBirth, int minimumAge)
    {
        return CalculateAge(dateOfBirth) >= minimumAge;
    }

    /// Ger ett valideringsfel om användaren är för ung
    public (bool IsValid, string? ErrorMessage) ValidateMinimumAge(DateTime dateOfBirth, int minimumAge)
    {
        var age = CalculateAge(dateOfBirth);
        
        if (age < minimumAge)
        {
            return (false, $"Du måste vara minst {minimumAge} år. Du är {age} år.");
        }

        return (true, null);
    }

    /// Validerar registrering (minst 18 år)
    public (bool IsValid, string? ErrorMessage) ValidateRegistrationAge(DateTime dateOfBirth)
    {
        if (!IsAtLeast18YearsOld(dateOfBirth))
        {
            var age = CalculateAge(dateOfBirth);
            return (false, $"Du måste vara minst 18 år för att registrera dig. Du är {age} år.");
        }

        return (true, null);
    }
}
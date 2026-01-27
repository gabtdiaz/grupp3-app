using grupp3_app.Api.Models;

namespace grupp3_app.Api.Services;

/// Status för om användare kan joina event (för UI)
public enum JoinStatus
{
    CanJoin,           // Användaren kan joina
    AlreadyJoined,     // Användaren har redan joinat
    EventFull,         // Event är fullt (visa men disable knapp)
    EventInactive,     // Event är inte aktivt
    GenderRestriction, // Fel kön (ska inte synas i lista)
    TooYoung          // För ung (ska inte synas i lista)
}

/// Service för att hantera event restrictions (gender, age, max participants)
public class EventRestrictionService
{
    private readonly AgeValidationService _ageValidationService;

    public EventRestrictionService(AgeValidationService ageValidationService)
    {
        _ageValidationService = ageValidationService;
    }


    /// Kollar om ett event ska vara SYNLIGT för en användare
    /// VIKTIGT: Fullt event ska SYNAS men inte gå att joina!
    public bool IsEventVisibleToUser(User user, Event eventToJoin)
    {
        // 1. Kolla om event är aktivt
        if (!eventToJoin.IsActive)
        {
            return false;
        }

        // 2. Kolla GenderRestriction - fel kön = DÖLJ helt
        if (!IsGenderAllowed(user.Gender, eventToJoin.GenderRestriction))
        {
            return false;
        }

        // 3. Kolla MinimumAge - för ung = DÖLJ helt
        if (eventToJoin.MinimumAge.HasValue)
        {
            var userAge = _ageValidationService.CalculateAge(user.DateOfBirth);
            if (userAge < eventToJoin.MinimumAge.Value)
            {
                return false;
            }
        }

        // 4. MaxParticipants påverkar INTE synlighet - fullt event ska synas!
        return true;
    }

    /// Kollar om en användare kan JOINA ett event (klicka på join-knappen)
    /// Returnerar om join är möjlig + status för UI
    public (bool CanJoin, JoinStatus Status, string? Message) CanUserJoinEvent(User user, Event eventToJoin, int currentParticipantsCount, bool hasAlreadyJoined)
    {
        // 1. Kolla om event är aktivt
        if (!eventToJoin.IsActive)
        {
            return (false, JoinStatus.EventInactive, "Event är inte aktivt");
        }

        // 2. Kolla om användaren redan joinat
        if (hasAlreadyJoined)
        {
            return (false, JoinStatus.AlreadyJoined, "Du har redan joinat detta event");
        }

        // 3. Kolla GenderRestriction
        if (!IsGenderAllowed(user.Gender, eventToJoin.GenderRestriction))
        {
            var genderMessage = eventToJoin.GenderRestriction switch
            {
                GenderRestriction.OnlyMen => "Detta event är endast för män",
                GenderRestriction.OnlyWomen => "Detta event är endast för kvinnor",
                _ => "Du uppfyller inte könsbegränsningen"
            };
            return (false, JoinStatus.GenderRestriction, genderMessage);
        }

        // 4. Kolla MinimumAge
        if (eventToJoin.MinimumAge.HasValue)
        {
            var userAge = _ageValidationService.CalculateAge(user.DateOfBirth);
            if (userAge < eventToJoin.MinimumAge.Value)
            {
                return (false, JoinStatus.TooYoung, $"Du måste vara minst {eventToJoin.MinimumAge} år för att joina");
            }
        }

        // 5. Kolla MaxParticipants - fullt = kan INTE joina (men eventet syns!)
        if (eventToJoin.MaxParticipants > 0 && currentParticipantsCount >= eventToJoin.MaxParticipants)
        {
            return (false, JoinStatus.EventFull, "Event är fullt - väntar på ledig plats");
        }

        // Allt OK - kan joina!
        return (true, JoinStatus.CanJoin, "Du kan joina detta event");
    }

    /// Kollar om användarens kön matchar event restriction
    private bool IsGenderAllowed(Gender userGender, GenderRestriction eventRestriction)
    {
        return eventRestriction switch
        {
            GenderRestriction.All => true,
            GenderRestriction.OnlyMen => userGender == Gender.Man,
            GenderRestriction.OnlyWomen => userGender == Gender.Kvinna,
            _ => false
        };
    }
}
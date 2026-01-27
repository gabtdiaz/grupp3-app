using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;
using grupp3_app.Api.DTOs.Events; //EventDto
using grupp3_app.Api.DTOs.Event;// CreateEventDto och UpdateEventDto
using grupp3_app.Api.Models;
using MiniValidation;
using System.Security.Claims;

namespace grupp3_app.Api.Endpoints;

public static class EventEndpoints
{
    // registrerar alla endpoints för Event
    public static void MapEventEndpoints(this IEndpointRouteBuilder app)
    {
        // api/events som kräver login
        var group = app.MapGroup("/api/events").RequireAuthorization();

        group.MapGet("/", GetAllEvents); //GET hämta alla event
        group.MapGet("/{id}", GetEventById);//GET hämta event med id
        group.MapPost("/", CreateEvent); //POST skapa nytt event
        group.MapPut("/{id}", UpdateEvent);//PUT uppdaterar event
        group.MapDelete("/{id}", DeleteEvent);//DELETE tar bort ett event
    }

    // POST /api/events skapa nytt event
    private static async Task<IResult> CreateEvent(
        CreateEventDto dto,
        ClaimsPrincipal user,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        if (!MiniValidator.TryValidate(dto, out var errors))
        {
            logger.LogWarning("Event creation validation failed");
            return Results.ValidationProblem(errors);
        }

        //hämta userId
        var userId = user.GetUserIdOrThrow();
        logger.LogInformation("User {UserId} creating event: {Title}", userId, dto.Title);

        var currentUser = await context.Users.FindAsync(userId);
        if (currentUser == null)
            return Results.NotFound("User not found");

        // skapar nytt Event
        var newEvent = new Event
        {
            Title = dto.Title,
            Description = dto.Description ?? string.Empty,
            Location = dto.Location,
            StartDateTime = dto.StartDateTime,
            EndDateTime = dto.EndDateTime ?? dto.StartDateTime.AddHours(1),
            ImageUrl = dto.ImageUrl,
            Category = dto.Category,
            MaxParticipants = dto.MaxParticipants,
            GenderRestriction = dto.GenderRestriction,
            MinimumAge = dto.MinimumAge ?? 18,
            CreatedBy = currentUser,
            CreatedByUserId = userId, // NY: Sätt även FK
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        //lägger till i databasen
        context.Events.Add(newEvent);
        await context.SaveChangesAsync();

        logger.LogInformation("Event {EventId} created successfully by user {UserId}", newEvent.Id, userId);

        return Results.Created($"/api/events/{newEvent.Id}", MapToEventDto(newEvent, currentUser));
    }

    // GET /api/events hämtar alla event
    // VIKTIGT: Filtrerar bort events baserat på ålder och kön
    // Men VISAR events som är fulla (användare kan se men inte joina)
    private static async Task<IResult> GetAllEvents(
        ApplicationDbContext context, 
        EventRestrictionService restrictionService, 
        ClaimsPrincipal user, 
        ILogger<Program> logger, 
        string? category = null, 
        string? city = null)
    {
        var userId = user.GetUserIdOrThrow();
        logger.LogInformation("User {UserId} fetching all events", userId);

        var query = context.Events
            .Include(e => e.CreatedBy)
            .Include(e => e.Participants)
            .Where(e => e.IsActive)
            .AsQueryable();

        // Filtrering baserat på category
        if (!string.IsNullOrEmpty(category) && Enum.TryParse<EventCategory>(category, true, out var cat))
        {
            query = query.Where(e => e.Category == cat);
        }

        // Filtrering baserat på city
        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(e => e.Location.Contains(city));
        }

        var events = await query.ToListAsync();

        // Hämta inloggad användare för filtrering
        var currentUser = await context.Users.FindAsync(userId);
        if (currentUser == null)
        {
            return Results.Unauthorized();
        }

        // Filtrera baserat på ålder och kön (INTE MaxParticipants!)
        events = events
            .Where(e => restrictionService.IsEventVisibleToUser(currentUser, e))
            .ToList();
        
        logger.LogInformation("User {UserId}: {EventCount} events visible after filtering", userId, events.Count);

        var dtos = events.Select(e => MapToEventDto(e, e.CreatedBy)).ToList();

        return Results.Ok(dtos);
    }

    // GET /api/events/{id} hämtaqr event med Id
    private static async Task<IResult> GetEventById(int id, ApplicationDbContext context, ILogger<Program> logger)
    {
        logger.LogInformation("Fetching event {EventId}", id);

        var e = await context.Events
            .Include(ev => ev.CreatedBy)
            .Include(ev => ev.Participants) // Tillagd: för att visa antal deltagare
            .FirstOrDefaultAsync(ev => ev.Id == id);

        if (e == null)
        {
            logger.LogWarning("Event {EventId} not found", id); 
            return Results.NotFound();
        }

        return Results.Ok(MapToEventDto(e, e.CreatedBy));
    }

    // PUT /api/events/{id} uppdaterar event
    private static async Task<IResult> UpdateEvent(
        int id, 
        UpdateEventDto dto, 
        ClaimsPrincipal user,
        ApplicationDbContext context, 
        ILogger<Program> logger)
    {
        if (!MiniValidator.TryValidate(dto, out var errors))
        {
            logger.LogWarning("Event update validation failed for event {EventId}", id);
            return Results.ValidationProblem(errors);
        }

        var userId = user.GetUserIdOrThrow(); // TILLAGT

        var e = await context.Events.FindAsync(id);
        if (e == null)
        {
            logger.LogWarning("Event {EventId} not found for update", id);
            return Results.NotFound();
        }

        // VIKTIGT: Kontrollera att användaren är creator
        if (e.CreatedByUserId != userId)
        {
            logger.LogWarning("User {UserId} attempted to update event {EventId} created by user {CreatorId}",
                userId, id, e.CreatedByUserId);
            return Results.Forbid();
        }

        if (!Enum.TryParse<EventCategory>(dto.Category, true, out var category))
            return Results.BadRequest($"Invalid category: {dto.Category}");

        if (!Enum.TryParse<GenderRestriction>(dto.GenderRestriction, true, out var genderRestriction))
            return Results.BadRequest($"Invalid gender restriction: {dto.GenderRestriction}");

        e.Title = dto.Title;
        e.Description = dto.Description;
        e.Location = dto.Location;
        e.StartDateTime = dto.StartDateTime;
        e.EndDateTime = dto.EndDateTime;
        e.ImageUrl = dto.ImageUrl;
        e.Category = category;
        e.GenderRestriction = genderRestriction;
        e.MaxParticipants = dto.MaxParticipants;
        e.MinimumAge = dto.MinimumAge;
        e.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Event {EventId} updated successfully", id);
        return Results.NoContent();
    }


    // DELETE /api/events/{id} tar bort event
    private static async Task<IResult> DeleteEvent(
        int id,
        ClaimsPrincipal user,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        var userId = user.GetUserIdOrThrow(); // Tillagt
        logger.LogInformation("Trying to delete event {EventId}", id);

        var e = await context.Events.FindAsync(id);
        if (e == null)
        {
            logger.LogWarning("Event {EventId} not found for deletion", id);
            return Results.NotFound();
        }

         // VIKTIGT: Kontrollera att användaren är creator
        if (e.CreatedByUserId != userId)
        {
            logger.LogWarning("User {UserId} attempted to delete event {EventId} created by user {CreatorId}",
                userId, id, e.CreatedByUserId);
            return Results.Forbid();
        }

         // Soft delete (sätt IsActive = false istället för att ta bort helt)
        e.IsActive = false;
        e.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation("Event {EventId} deleted successfully by user {UserId}", id, userId);
        return Results.NoContent();
    }

    //tar eventet från databasen, plockar ut de fält vi vill visa i frontend 
    //och gör om vissa värden, enums
    private static EventDto MapToEventDto(Event e, User user)
    {
        return new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.Description,
            Location = e.Location,
            StartDateTime = e.StartDateTime,
            EndDateTime = e.EndDateTime,
            ImageUrl = e.ImageUrl,
            Category = e.Category.ToString(),
            GenderRestriction = e.GenderRestriction.ToString(),
            MaxParticipants = e.MaxParticipants,
            CurrentParticipants = e.Participants.Count, // Tillagt: Antal deltagare
            MinimumAge = e.MinimumAge,
            IsActive = e.IsActive,
            CreatedAt = e.CreatedAt,
            CreatedBy = $"{user.FirstName} {user.LastName[0]}."
        };
    }
}

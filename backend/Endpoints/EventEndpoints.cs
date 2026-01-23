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

        group.MapPost("/", CreateEvent); //POST skapa nytt event
        group.MapGet("/", GetAllEvents); //GET hämta alla event
        group.MapGet("/{id}", GetEventById);//GET hämta event med id
        group.MapPut("/{id}", UpdateEvent);//PUT uppdaterar event
        group.MapDelete("/{id}", DeleteEvent);//DELETE tar bort ett event
    }

    // POST /api/events skapa nytt event
    private static async Task<IResult> CreateEvent(
        CreateEventDto dto,
        ApplicationDbContext context,
        HttpContext httpContext)
    {
        if (!MiniValidator.TryValidate(dto, out var errors))
            return Results.ValidationProblem(errors);

        //hämta userId
        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? httpContext.User.FindFirst("sub")?.Value;

        if (userIdClaim == null)
            return Results.Unauthorized();

        var userId = int.Parse(userIdClaim);
        var user = await context.Users.FindAsync(userId);
        if (user == null)
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
            CreatedBy = user,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        //lägger till i databasen
        context.Events.Add(newEvent);
        await context.SaveChangesAsync();

        return Results.Created($"/api/events/{newEvent.Id}", MapToEventDto(newEvent, user));
    }

    // GET /api/events hämtar alla event
    private static async Task<IResult> GetAllEvents(ApplicationDbContext context)
    {
        var events = await context.Events
            .Include(e => e.CreatedBy)
            .ToListAsync();

        var dtos = events.Select(e => MapToEventDto(e, e.CreatedBy)).ToList();
        return Results.Ok(dtos);
    }

    // GET /api/events/{id} hämtaqr event med Id
    private static async Task<IResult> GetEventById(int id, ApplicationDbContext context)
    {
        var e = await context.Events
            .Include(ev => ev.CreatedBy)
            .FirstOrDefaultAsync(ev => ev.Id == id);

        if (e == null)
            return Results.NotFound();

        return Results.Ok(MapToEventDto(e, e.CreatedBy));
    }

    // PUT /api/events/{id} uppdaterar event
    private static async Task<IResult> UpdateEvent(int id, UpdateEventDto dto, ApplicationDbContext context)
    {
        if (!MiniValidator.TryValidate(dto, out var errors))
            return Results.ValidationProblem(errors);

        var e = await context.Events.FindAsync(id);
        if (e == null)
            return Results.NotFound();

        e.Title = dto.Title;
        e.Description = dto.Description;
        e.Location = dto.Location;
        e.StartDateTime = dto.StartDateTime;
        e.EndDateTime = dto.EndDateTime;
        e.ImageUrl = dto.ImageUrl;
        e.Category = Enum.Parse<EventCategory>(dto.Category);
        e.GenderRestriction = Enum.Parse<GenderRestriction>(dto.GenderRestriction);
        e.MaxParticipants = dto.MaxParticipants;
        e.MinimumAge = dto.MinimumAge;
        e.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        return Results.NoContent();
    }

    // DELETE /api/events/{id} tar bort event
    private static async Task<IResult> DeleteEvent(int id, ApplicationDbContext context)
    {
        var e = await context.Events.FindAsync(id);
        if (e == null)
            return Results.NotFound();

        context.Events.Remove(e);
        await context.SaveChangesAsync();

        return Results.NoContent();
    }

    //tar eventet från databasen, plockar ut de fält vi vill visa i frontend 
    //och gör om vissa värden
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
            MinimumAge = e.MinimumAge,
            IsActive = e.IsActive,
            CreatedAt = e.CreatedAt,
            CreatedBy = $"{user.FirstName} {user.LastName[0]}."
        };
    }
}

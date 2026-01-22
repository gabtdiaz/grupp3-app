using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;
using grupp3_app.Api.DTOs.Events;
using grupp3_app.Api.Models;
using MiniValidation;//när vi lägger till en POST 

namespace grupp3_app.Api.Endpoints;

public static class EventEndpoints
{
    //registrerar alla Event-endpoints
    public static void MapEventEndpoints(this IEndpointRouteBuilder app)
    {
        // ALLA endpoints kräver login
        var group = app.MapGroup("/api/events").RequireAuthorization();

        // group.MapPost("/", CreateEvent); //lägg till efter hämtat DTO-kod från Filippa

        group.MapGet("/", GetAllEvents); // GET: hämtar alla event
        group.MapGet("/{id}", GetEventById);// GET: hämtar ett specifikt event
        group.MapPut("/{id}", UpdateEvent);// PUT: uppdatera ett event
        group.MapDelete("/{id}", DeleteEvent);// DELETE: ta bort ett event
    }

    // GET /api/events
    private static async Task<IResult> GetAllEvents(ApplicationDbContext context)
    {
        //hämtar alla events och skapare
        var events = await context.Events
            .Include(e => e.CreatedBy)
            .ToListAsync();

        // mappa varje Event + User till EventDto
        var dtos = events.Select(e => MapToEventDto(e, e.CreatedBy)).ToList();

        return Results.Ok(dtos);
    }

    // GET /api/events/{id}
    private static async Task<IResult> GetEventById(int id, ApplicationDbContext context)
    {
        // hämta event och skapare
        var e = await context.Events
            .Include(ev => ev.CreatedBy)
            .FirstOrDefaultAsync(ev => ev.Id == id);

        if (e == null) return Results.NotFound();

        var dto = MapToEventDto(e, e.CreatedBy);
        return Results.Ok(dto);
    }

    // PUT /api/events/{id}
    private static async Task<IResult> UpdateEvent(int id, UpdateEventDto dto, ApplicationDbContext context)
    {
        // hämta event från databasen
        var e = await context.Events.FindAsync(id);
        if (e == null) return Results.NotFound();

        //uppdatera alla fält
        e.Title = dto.Title;
        e.Description = dto.Description;
        e.Location = dto.Location;
        e.StartDateTime = dto.StartDateTime;
        e.EndDateTime = dto.EndDateTime;
        e.ImageUrl = dto.ImageUrl;
        e.Category = Enum.Parse<EventCategory>(dto.Category); //enum blir en string i frontend
        e.MaxParticipants = dto.MaxParticipants;
        e.GenderRestriction = Enum.Parse<GenderRestriction>(dto.GenderRestriction);
        e.MinimumAge = dto.MinimumAge;
        e.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        return Results.NoContent();
    }

    // DELETE /api/events/{id}
    private static async Task<IResult> DeleteEvent(int id, ApplicationDbContext context)
    {
        // hämta event
        var e = await context.Events.FindAsync(id);
        if (e == null) return Results.NotFound();

        // ta bort event från databasen
        context.Events.Remove(e);
        await context.SaveChangesAsync();

        return Results.NoContent();
    }

    // gör om ett Event till ett EventDto som kan skickas till frontend
    private static EventDto MapToEventDto(Event e, User user)
    {
        return new EventDto
        {
            Id = e.Id, // eventets ID
            Title = e.Title, // titel på eventet
            Description = e.Description, // beskrivning
            Location = e.Location, // plats
            StartDateTime = e.StartDateTime, // starttid
            EndDateTime = e.EndDateTime, // sluttid
            ImageUrl = e.ImageUrl, // bild
            Category = e.Category.ToString(), // kategori, enum blir en string
            GenderRestriction = e.GenderRestriction.ToString(), // könsrestriktion, enum → string
            MaxParticipants = e.MaxParticipants, // max antal deltagare
            MinimumAge = e.MinimumAge, // minimiålder
            IsActive = e.IsActive, // om eventet är aktivt
            CreatedAt = e.CreatedAt, // datum när eventet skapades
            CreatedBy = $"{user.FirstName} {user.LastName[0]}." // namn på skaparen
        };
    }
}

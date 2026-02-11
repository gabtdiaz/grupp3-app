using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;
using grupp3_app.Api.Models;
using grupp3_app.Api.Services;
using grupp3_app.Api.Extensions;
using System.Security.Claims;

namespace grupp3_app.Api.Endpoints;

public static class EventParticipationEndpoints
{
    public static void MapEventParticipationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/events")
            .RequireAuthorization(); // Kräver inloggning för alla endpoints

        group.MapPost("/{id}/join", JoinEvent);
        group.MapDelete("/{id}/leave", LeaveEvent);
        group.MapGet("/me/joined", GetMyJoinedEvents);
        group.MapDelete("/{eventId}/participants/{userId}", RemoveParticipant);
    }

    /// POST /api/events/{id}/join - Joina ett event
    private static async Task<IResult> JoinEvent(
        int id,
        ClaimsPrincipal user,
        ApplicationDbContext context,
        EventRestrictionService restrictionService,
        ILogger<Program> logger)
    {
        var userId = user.GetUserIdOrThrow();
        logger.LogInformation("User {UserId} attempting to join event {EventId}", userId, id);

        // Hämta event med participants
        var eventToJoin = await context.Events
            .Include(e => e.Participants)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (eventToJoin == null)
        {
            logger.LogWarning("Event {EventId} not found for join", id);
            return Results.NotFound(new { message = "Event finns inte" });
        }

        // Kolla om användaren redan har joinat
        var hasAlreadyJoined = await context.EventParticipants
            .AnyAsync(ep => ep.EventId == id && ep.UserId == userId);

        // Hämta användaren för validering
        var currentUser = await context.Users.FindAsync(userId);
        if (currentUser == null)
        {
            return Results.Unauthorized();
        }

        // Kolla om användaren kan joina
        var currentParticipantsCount = eventToJoin.Participants.Count;
        var (canJoin, status, message) = restrictionService.CanUserJoinEvent(
            currentUser,
            eventToJoin,
            currentParticipantsCount,
            hasAlreadyJoined
        );

        if (!canJoin)
        {
            logger.LogWarning("User {UserId} cannot join event {EventId}: {Status} - {Message}",
                userId, id, status, message);
            return Results.BadRequest(new { message, status = status.ToString() });
        }

        // Skapa participation
        var participant = new EventParticipant
        {
            EventId = id,
            UserId = userId,
            JoinedAt = DateTime.UtcNow,
            Status = ParticipantStatus.Confirmed
        };

        context.EventParticipants.Add(participant);
        await context.SaveChangesAsync();

        logger.LogInformation("User {UserId} successfully joined event {EventId}", userId, id);

        return Results.Ok(new
        {
            message = "Du har joinat eventet!",
            eventId = id,
            joinedAt = participant.JoinedAt
        });
    }

    /// DELETE /api/events/{id}/leave - Lämna ett event
    private static async Task<IResult> LeaveEvent(
        int id,
        ClaimsPrincipal user,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        var userId = user.GetUserIdOrThrow();
        logger.LogInformation("User {UserId} attempting to leave event {EventId}", userId, id);

        var participant = await context.EventParticipants
            .FirstOrDefaultAsync(ep => ep.EventId == id && ep.UserId == userId);

        if (participant == null)
        {
            logger.LogWarning("User {UserId} has not joined event {EventId}", userId, id);
            return Results.NotFound(new { message = "Du har inte joinat detta event" });
        }

        context.EventParticipants.Remove(participant);
        await context.SaveChangesAsync();

        logger.LogInformation("User {UserId} successfully left event {EventId}", userId, id);

        return Results.Ok(new { message = "Du har lämnat eventet" });
    }

    /// GET /api/events/me/joined - Hämta mina joinade events
    private static async Task<IResult> GetMyJoinedEvents(
        ClaimsPrincipal user,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        var userId = user.GetUserIdOrThrow();
        logger.LogInformation("User {UserId} fetching joined events", userId);

        var joinedEvents = await context.EventParticipants
            .Where(ep => ep.UserId == userId)
            .Include(ep => ep.Event)
                .ThenInclude(e => e.CreatedBy)
            .Include(ep => ep.Event)
                .ThenInclude(e => e.Participants)
            .Select(ep => new
            {
                ep.Event.Id,
                ep.Event.Title,
                ep.Event.Description,
                ep.Event.Location,
                ep.Event.StartDateTime,
                ep.Event.EndDateTime,
                ep.Event.ImageUrl,
                Category = ep.Event.Category.ToString(),
                ep.Event.MaxParticipants,
                CurrentParticipants = ep.Event.Participants.Count,
                JoinedAt = ep.JoinedAt,
                Status = ep.Status.ToString(),
                CreatedBy = $"{ep.Event.CreatedBy.FirstName} {ep.Event.CreatedBy.LastName[0]}."
            })
            .ToListAsync();

        logger.LogInformation("User {UserId} has joined {EventCount} events", userId, joinedEvents.Count);

        return Results.Ok(joinedEvents);
    }

    /// DELETE /api/events/{eventId}/participants/{userId} - Remove a participant (creator only)
    private static async Task<IResult> RemoveParticipant(
        int eventId,
        int userId,
        ClaimsPrincipal user,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        var currentUserId = user.GetUserIdOrThrow();
        logger.LogInformation("User {CurrentUserId} attempting to remove user {UserId} from event {EventId}",
            currentUserId, userId, eventId);

        // Verify the event exists and get the creator
        var eventToModify = await context.Events
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (eventToModify == null)
        {
            logger.LogWarning("Event {EventId} not found", eventId);
            return Results.NotFound(new { message = "Event finns inte" });
        }

        // Only the event creator can remove participants
        if (eventToModify.CreatedByUserId != currentUserId)
        {
            logger.LogWarning("User {CurrentUserId} is not the creator of event {EventId}",
                currentUserId, eventId);
            return Results.Forbid();
        }

        // Don't allow creator to remove themselves
        if (userId == currentUserId)
        {
            logger.LogWarning("User {CurrentUserId} attempted to remove themselves from their own event",
                currentUserId);
            return Results.BadRequest(new { message = "Du kan inte ta bort dig själv som arrangör" });
        }

        // Find the participant
        var participant = await context.EventParticipants
            .FirstOrDefaultAsync(ep => ep.EventId == eventId && ep.UserId == userId);

        if (participant == null)
        {
            logger.LogWarning("User {UserId} is not a participant of event {EventId}", userId, eventId);
            return Results.NotFound(new { message = "Användaren är inte med i eventet" });
        }

        // Remove the participant
        context.EventParticipants.Remove(participant);
        await context.SaveChangesAsync();

        logger.LogInformation("User {CurrentUserId} successfully removed user {UserId} from event {EventId}",
            currentUserId, userId, eventId);

        return Results.Ok(new { message = "Deltagare borttagen" });
    }
}
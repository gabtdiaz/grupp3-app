using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;
using grupp3_app.Api.DTOs.Comment;
using grupp3_app.Api.Models;
using MiniValidation;
using System.Security.Claims;

namespace grupp3_app.Api.Endpoints;

public static class CommentEndpoints
{
    public static void MapCommentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/events/{eventId}/comments")
            .RequireAuthorization();

        group.MapPost("/", CreateComment);                 
        group.MapGet("/", GetEventComments);             
        group.MapDelete("/{commentId}", DeleteComment); 
    }

    private static async Task<IResult> CreateComment(
        int eventId,
        CreateCommentDto dto,
        ApplicationDbContext context,
        ClaimsPrincipal user,
        ILogger<Program> logger)
    {
        if (!MiniValidator.TryValidate(dto, out var errors))
        {
            logger.LogWarning("Comment creation validation failed for event {EventId}", eventId);
            return Results.ValidationProblem(errors);
        }

        // Fetch userId from token
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            logger.LogWarning("Unauthorized comment creation attempt on event {EventId}", eventId);
            return Results.Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        // Check if eventet exists
        var eventExists = await context.Events.AnyAsync(e => e.Id == eventId);
        if (!eventExists)
        {
            logger.LogWarning("Comment creation failed: Event {EventId} not found", eventId);
            return Results.NotFound("Event not found");
        }

        // If reply, check parent comment exists
        if (dto.ParentCommentId.HasValue)
        {
            var parentExists = await context.EventComments
                .AnyAsync(c => c.Id == dto.ParentCommentId.Value && c.EventId == eventId);
            
            if (!parentExists)
            {
                logger.LogWarning("Parent comment {ParentId} not found for event {EventId}", 
                    dto.ParentCommentId.Value, eventId);
                return Results.NotFound("Parent comment not found");
            }
        }

        logger.LogInformation("User {UserId} creating comment on event {EventId}", userId, eventId);

        var comment = new EventComment
        {
            Content = dto.Content,
            EventId = eventId,
            UserId = userId,
            ParentCommentId= dto.ParentCommentId,
            CreatedAt = DateTime.UtcNow
        };

        context.EventComments.Add(comment);
        await context.SaveChangesAsync();

        // Fetch user to return author info
        var author = await context.Users.FindAsync(userId);
        var commentDto = new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            AuthorId = userId,
            AuthorName = $"{author!.FirstName} {author.LastName[0]}.",
            AuthorImageUrl = author.ProfileImageUrl,
            ParentCommentId = comment.ParentCommentId,
            Replies = new List<CommentDto>()
        };

        logger.LogInformation("Comment {CommentId} created on event {EventId} by user {UserId}", 
            comment.Id, eventId, userId);

        return Results.Created($"/api/events/{eventId}/comments/{comment.Id}", commentDto);
    }

    private static async Task<IResult> GetEventComments(
        int eventId,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        logger.LogInformation("Fetching comments for event {EventId}", eventId);

        var allComments = await context.EventComments
            .Where(c => c.EventId == eventId)
            .Include(c => c.User)
            .OrderBy(c => c.CreatedAt) 
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                AuthorId = c.UserId,
                AuthorName = $"{c.User.FirstName} {c.User.LastName.Substring(0, 1)}.",
                AuthorImageUrl = c.User.ProfileImageUrl,
                ParentCommentId = c.ParentCommentId,
                Replies = new List<CommentDto>()
            })
            .ToListAsync();

        // Bygg hierarki: top-level comments med nested replies
        var topLevelComments = allComments
            .Where(c => c.ParentCommentId == null)
            .ToList();

        // Lägg till replies till varje top-level comment
        foreach (var topComment in topLevelComments)
        {
            topComment.Replies = allComments
                .Where(c => c.ParentCommentId == topComment.Id)
                .ToList();
        }

        logger.LogInformation("Retrieved {CommentCount} top-level comments with replies for event {EventId}", 
            topLevelComments.Count, eventId);

        return Results.Ok(topLevelComments);
    }

   private static async Task<IResult> DeleteComment(
        int eventId,
        int commentId,
        ApplicationDbContext context,
        ClaimsPrincipal user,
        ILogger<Program> logger)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            logger.LogWarning("Unauthorized comment deletion attempt");
            return Results.Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        logger.LogInformation("User {UserId} attempting to delete comment {CommentId}", 
            userId, commentId);

        var comment = await context.EventComments
            .Include(c => c.Replies)
            .FirstOrDefaultAsync(c => c.Id == commentId && c.EventId == eventId);

        if (comment == null)
        {
            logger.LogWarning("Comment {CommentId} not found for event {EventId}", 
                commentId, eventId);
            return Results.NotFound("Comment not found");
        }

        if (comment.UserId != userId)
        {
            logger.LogWarning("User {UserId} attempted to delete comment {CommentId} owned by user {OwnerId}", 
                userId, commentId, comment.UserId);
            return Results.Forbid();
        }

        // Check if parent comment
        if (comment.ParentCommentId == null && comment.Replies.Any())
        {
            // Soft delete: Replace content and keep replies
            comment.Content = "[Kommentaren är borttagen]";
            comment.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync();
            
            logger.LogInformation("Parent comment {CommentId} soft deleted (has {ReplyCount} replies)", 
                commentId, comment.Replies.Count);
        }
        else
        {
            // Hard delete: Remove reply or parent without replies
            context.EventComments.Remove(comment);
            await context.SaveChangesAsync();
            
            logger.LogInformation("Comment {CommentId} hard deleted", commentId);
        }

        return Results.NoContent();
    }
}
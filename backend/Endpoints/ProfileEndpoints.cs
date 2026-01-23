using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;
using grupp3_app.Api.DTOs.Profile;
using grupp3_app.Api.Models;
using MiniValidation;

namespace grupp3_app.Api.Endpoints;

public static class ProfileEndpoints
{
    public static void MapProfileEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/profile")
            .RequireAuthorization(); // All endpoints require auth

        group.MapGet("", GetCurrentUserProfile);
        group.MapPut("", UpdateCurrentUserProfile);
        group.MapGet("/{userId}", GetUserProfileById);
    }

    private static async Task<IResult> GetCurrentUserProfile(
        ClaimsPrincipal user,
        ApplicationDbContext context)
    {
        // Get userId från JWT token
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null)
        {
            return Results.Problem("User ID not found in token", statusCode: 401);
        }

        var userId = int.Parse(userIdClaim);

        // Fetch user from database
        var currentUser = await context.Users.FindAsync(userId);

        if (currentUser == null)
        {
            return Results.NotFound("User not found");
        }

        // Map to ProfileDto
        var profileDto = new ProfileDto
        {
            Id = currentUser.Id,
            Email = currentUser.Email,
            FirstName = currentUser.FirstName,
            LastName = currentUser.LastName,
            DateOfBirth = currentUser.DateOfBirth,
            Gender = currentUser.Gender,
            City = currentUser.City,
            ProfileImageUrl = currentUser.ProfileImageUrl,
            Bio = currentUser.Bio,
            Interests = currentUser.Interests,
            CreatedAt = currentUser.CreatedAt
        };

        return Results.Ok(profileDto);
    }

    private static async Task<IResult> UpdateCurrentUserProfile(
        UpdateProfileDto updateDto,
        ClaimsPrincipal user,
        ApplicationDbContext context)
    {
        // Validate input
        if (!MiniValidator.TryValidate(updateDto, out var errors))
        {
            return Results.ValidationProblem(errors);
        }

        // Get userId from JWT token
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userIdClaim == null)
        {
            return Results.Problem("User ID not found in token", statusCode: 401);
        }

        var userId = int.Parse(userIdClaim);

        // Fetch user from database
        var currentUser = await context.Users.FindAsync(userId);

        if (currentUser == null)
        {
            return Results.NotFound("User not found");
        }

        // Update fields
        currentUser.FirstName = updateDto.FirstName;
        currentUser.LastName = updateDto.LastName;
        currentUser.City = updateDto.City;
        currentUser.Bio = updateDto.Bio;
        currentUser.Interests = updateDto.Interests;
        currentUser.ProfileImageUrl = updateDto.ProfileImageUrl;
        currentUser.UpdatedAt = DateTime.UtcNow;

        // Save changes
        await context.SaveChangesAsync();

        // Map to ProfileDto and return
        var profileDto = new ProfileDto
        {
            Id = currentUser.Id,
            Email = currentUser.Email,
            FirstName = currentUser.FirstName,
            LastName = currentUser.LastName,
            DateOfBirth = currentUser.DateOfBirth,
            Gender = currentUser.Gender,
            City = currentUser.City,
            ProfileImageUrl = currentUser.ProfileImageUrl,
            Bio = currentUser.Bio,
            Interests = currentUser.Interests,
            CreatedAt = currentUser.CreatedAt
        };

        return Results.Ok(profileDto);
    }

    private static async Task<IResult> GetUserProfileById(
        int userId,
        ApplicationDbContext context)
    {
        // Fetch user from database
        var userProfile = await context.Users.FindAsync(userId);

        if (userProfile == null)
        {
            return Results.NotFound("User not found");
        }
    
        // Map to ProfileDto (public view)
        var profileDto = new ProfileDto
        {
            Id = userProfile.Id,
            Email = userProfile.Email,
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            DateOfBirth = userProfile.DateOfBirth,
            Gender = userProfile.Gender,
            City = userProfile.City,
            ProfileImageUrl = userProfile.ProfileImageUrl,
            Bio = userProfile.Bio,
            Interests = userProfile.Interests,
            CreatedAt = userProfile.CreatedAt
        };

        return Results.Ok(profileDto);
    }
}
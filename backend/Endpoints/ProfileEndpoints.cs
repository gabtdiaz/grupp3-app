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
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        // Get userId från JWT token
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null)
        {
            logger.LogWarning("Unauthorized access attempt: User ID not found in token");
            return Results.Problem("User ID not found in token", statusCode: 401);
        }

        var userId = int.Parse(userIdClaim);
        logger.LogInformation("User {UserId} fetching own profile", userId);

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
            Age = CalculateAge(currentUser.DateOfBirth),
            Gender = currentUser.Gender.ToString(),
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
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        // Validate input
        if (!MiniValidator.TryValidate(updateDto, out var errors))
        {
            logger.LogWarning("Profile update validation failed");
            return Results.ValidationProblem(errors);
        }

        // Get userId from JWT token
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userIdClaim == null)
        {
            logger.LogWarning("Unauthorized profile update attempt: User ID not found in token");
            return Results.Problem("User ID not found in token", statusCode: 401);
        }

        var userId = int.Parse(userIdClaim);
        logger.LogInformation("User {UserId} updating profile", userId);

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
        logger.LogInformation("User {UserId} updated profile successfully", userId);

        // Map to ProfileDto and return
        var profileDto = new ProfileDto
        {
            Id = currentUser.Id,
            Email = currentUser.Email,
            FirstName = currentUser.FirstName,
            LastName = currentUser.LastName,
            DateOfBirth = currentUser.DateOfBirth,
            Age = CalculateAge(currentUser.DateOfBirth),
            Gender = currentUser.Gender.ToString(),
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
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        logger.LogInformation("Fetching public profile for user {UserId}", userId);

        // Fetch user from database
        var userProfile = await context.Users.FindAsync(userId);

        if (userProfile == null)
        {
            logger.LogWarning("Profile not found for user {UserId}", userId);
            return Results.NotFound("User not found");
        }

        // Calculate age
        var age = CalculateAge(userProfile.DateOfBirth);
    
        // Map to ProfileDto (public view)
        var publicProfileDto = new PublicProfileDto
        {
            Id = userProfile.Id,
            DisplayName = $"{userProfile.FirstName} {userProfile.LastName[0]}",
            Age = age,
            City = userProfile.City,
            ProfileImageUrl = userProfile.ProfileImageUrl,
            Bio = userProfile.Bio,
            Interests = userProfile.Interests,
        };

        return Results.Ok(publicProfileDto);
    }

    // Helper method
    private static int CalculateAge(DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Year;

        if (dateOfBirth.Date > today.AddYears(-age))
        {
            age--;
        }

        return age;
    }
}
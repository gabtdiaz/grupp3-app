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

        // ✅ NEW: Update email
        group.MapPut("/email", UpdateCurrentUserEmail);

        group.MapGet("/{userId}", GetUserProfileById);
        group.MapPost("/upload-image", UploadProfileImage)
            .DisableAntiforgery()
            .Accepts<IFormFile>("multipart/form-data")
            .Produces<string>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .WithDescription("Ladda upp eller ändra profilbild för inloggad användare");
        group.MapGet("/image", GetProfileImage);

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
            CreatedAt = currentUser.CreatedAt,
            ShowGender = currentUser.ShowGender,
            ShowAge = currentUser.ShowAge,
            ShowCity = currentUser.ShowCity,
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
        if (Enum.TryParse<Gender>(updateDto.Gender, out var gender))
        {
            currentUser.Gender = gender;
        }
        else
        {
            return Results.BadRequest("Invalid gender value");
        }
        currentUser.ShowGender = updateDto.ShowGender;
        currentUser.ShowAge = updateDto.ShowAge;
        currentUser.ShowCity = updateDto.ShowCity;
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
            CreatedAt = currentUser.CreatedAt,
            ShowGender = currentUser.ShowGender,
            ShowAge = currentUser.ShowAge,
            ShowCity = currentUser.ShowCity,
        };

        return Results.Ok(profileDto);
    }

    // Update current user's email
    private static async Task<IResult> UpdateCurrentUserEmail(
        UpdateEmailDto dto,
        ClaimsPrincipal user,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        // Validate input
        if (!MiniValidator.TryValidate(dto, out var errors))
        {
            logger.LogWarning("Email update validation failed");
            return Results.ValidationProblem(errors);
        }

        // Get userId from JWT token
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null)
        {
            logger.LogWarning("Unauthorized email update attempt: User ID not found in token");
            return Results.Problem("User ID not found in token", statusCode: 401);
        }

        if (!int.TryParse(userIdClaim, out var userId))
        {
            logger.LogWarning("Unauthorized email update attempt: Invalid user id claim");
            return Results.Problem("Invalid user id claim", statusCode: 401);
        }

        logger.LogInformation("User {UserId} updating email", userId);

        // Fetch user from database
        var currentUser = await context.Users.FindAsync(userId);

        if (currentUser == null)
        {
            return Results.NotFound("User not found");
        }

        var email = dto.Email.Trim();

        // Ensure unique email
        var exists = await context.Users.AnyAsync(u => u.Email == email && u.Id != userId);
        if (exists)
        {
            return Results.BadRequest("Email already in use");
        }

        currentUser.Email = email;
        currentUser.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        logger.LogInformation("User {UserId} updated email successfully", userId);

        return Results.Ok(new { email = currentUser.Email });
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
            Age = userProfile.ShowAge ? age : null,
            Gender = userProfile.ShowGender ? userProfile.Gender.ToString() : null,
            City = userProfile.ShowCity ? userProfile.City : null,
            ProfileImageUrl = userProfile.ProfileImageUrl,
            Bio = userProfile.Bio,
            Interests = userProfile.Interests,
        };

        return Results.Ok(publicProfileDto);
    }

    private static async Task<IResult> UploadProfileImage(
        ClaimsPrincipal user,
        IFormFile file,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        if (file == null || file.Length == 0) return Results.BadRequest("Ingen fil uppladdad.");

        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Results.Unauthorized();

        var userId = int.Parse(userIdClaim);
        var currentUser = await context.Users.FindAsync(userId);
        if (currentUser == null) return Results.NotFound("Användaren hittades inte.");

        var allowedTypes = new[] { "image/jpeg", "image/png" };
        if (!allowedTypes.Contains(file.ContentType))
            return Results.BadRequest("Endast JPG eller PNG-filer tillåtna.");

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);

        // Radera gammal bild
        currentUser.ProfileImageData = ms.ToArray();
        currentUser.ProfileImageFileType = file.ContentType;
        currentUser.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        logger.LogInformation("User {UserId} uploaded/updated profile image", userId);

        return Results.Ok("Profilbilden har uppdaterats.");
    }

    private static async Task<IResult> GetProfileImage(
       ClaimsPrincipal user,
       ApplicationDbContext context)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Results.Unauthorized();

        var userId = int.Parse(userIdClaim);
        var currentUser = await context.Users.FindAsync(userId);
        if (currentUser == null || currentUser.ProfileImageData == null)
            return Results.NotFound("Ingen profilbild.");

        return Results.File(currentUser.ProfileImageData, currentUser.ProfileImageFileType ?? "image/jpeg");
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

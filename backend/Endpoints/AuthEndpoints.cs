using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;
using grupp3_app.Api.DTOs.Auth;
using grupp3_app.Api.Models;
using grupp3_app.Api.Services;
using MiniValidation;

namespace grupp3_app.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/register", Register);
        group.MapPost("/login", Login);
        group.MapPut("/password", ChangePassword).RequireAuthorization();
    }

    private static async Task<IResult> Register(
        RegisterDto registerDto,
        ApplicationDbContext context,
        ITokenService tokenService,
        ILogger<Program> logger)
    {
        // Validate input
        if (!MiniValidator.TryValidate(registerDto, out var errors))
        {
            logger.LogWarning("Registration validation failed for {Email}", registerDto.Email);
            return Results.ValidationProblem(errors);
        }

        // Check if mail already exists
        if (await context.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            logger.LogWarning("Registration failed: Email {Email} already exists", registerDto.Email);
            return Results.BadRequest("Email already exists");
        }

        logger.LogInformation("Creating new user: {Email}", registerDto.Email);

        // Create User
        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            DateOfBirth = registerDto.DateOfBirth,
            Gender = registerDto.Gender,
            City = registerDto.City
        };

        // Save to database
        context.Users.Add(user);
        await context.SaveChangesAsync();

        logger.LogInformation("User {UserId} registered successfully", user.Id);

        // Create UserDto with token
        var userDto = new UserDto
        {
            Email = user.Email,
            DisplayName = $"{user.FirstName} {user.LastName[0]}",
            Token = tokenService.CreateToken(user)
        };

        return Results.Ok(userDto);
    }

    private static async Task<IResult> Login(
        LoginDto loginDto,
        ApplicationDbContext context,
        ITokenService tokenService,
        ILogger<Program> logger)
    {
        logger.LogInformation("Login attempt for {Email}", loginDto.Email);

        // Validate input
        if (!MiniValidator.TryValidate(loginDto, out var errors))
        {
            logger.LogWarning("Login validation failed for {Email}", loginDto.Email);
            return Results.ValidationProblem(errors);
        }

        // Find user
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            logger.LogWarning("Login failed: User not found for {Email}", loginDto.Email);
            return Results.Problem(
                detail: "Invalid email or password",
                statusCode: 401
            );
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            logger.LogWarning("Login failed: Invalid password for {Email}", loginDto.Email);
            return Results.Problem(
                detail: "Invalid email or password",
                statusCode: 401
            );
        }

        logger.LogInformation("User {UserId} logged in successfully", user.Id);

        // Create UserDto with token
        var userDto = new UserDto
        {
            Email = user.Email,
            DisplayName = $"{user.FirstName} {user.LastName[0]}",
            Token = tokenService.CreateToken(user)
        };

        return Results.Ok(userDto);
    }

    // Change password endpoint
    private static async Task<IResult> ChangePassword(
        ChangePasswordDto dto,
        ClaimsPrincipal user,
        ApplicationDbContext context,
        ILogger<Program> logger)
    {
        // Validate input
        if (!MiniValidator.TryValidate(dto, out var errors))
        {
            logger.LogWarning("Change password validation failed");
            return Results.ValidationProblem(errors);
        }

        // Get userId from JWT token
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            logger.LogWarning("Unauthorized password change attempt: User ID not found in token");
            return Results.Problem("User ID not found in token", statusCode: 401);
        }

        if (!int.TryParse(userIdClaim, out var userId))
        {
            logger.LogWarning("Unauthorized password change attempt: Invalid user id claim");
            return Results.Problem("Invalid user id claim", statusCode: 401);
        }

        var dbUser = await context.Users.FindAsync(userId);
        if (dbUser == null)
        {
            logger.LogWarning("Password change failed: User not found for userId {UserId}", userId);
            return Results.NotFound("User not found");
        }

        // Verify old password
        if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, dbUser.PasswordHash))
        {
            logger.LogWarning("Change password failed: wrong old password for user {UserId}", userId);
            return Results.BadRequest("Nuvarande lösenord är fel");
        }

        // Optional: prevent reusing same password
        if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, dbUser.PasswordHash))
        {
            return Results.BadRequest("Nya lösenordet måste vara annorlunda än det gamla");
        }

        // Update password hash
        dbUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        dbUser.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("User {UserId} changed password successfully", userId);

        return Results.NoContent();
    }
}

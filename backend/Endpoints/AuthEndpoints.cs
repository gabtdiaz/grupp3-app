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
}
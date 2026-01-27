using System.Security.Claims;

namespace grupp3_app.Api.Extensions;

/// Extension methods för ClaimsPrincipal (inloggad användare)
/// Förenklar hämtning av userId från JWT token
public static class ClaimsPrincipalExtensions
{
    /// Hämtar userId från JWT token
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? user.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return null;
        }

        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }

        return null;
    }

    /// Hämtar userId eller kastar exception om inte inloggad
    public static int GetUserIdOrThrow(this ClaimsPrincipal user)
    {
        var userId = user.GetUserId();
        
        if (!userId.HasValue)
        {
            throw new UnauthorizedAccessException("User is not authenticated or userId is missing");
        }

        return userId.Value;
    }

    /// Hämtar email från JWT token
    public static string? GetEmail(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Email)?.Value;
    }

    /// Kollar om användaren är inloggad
    public static bool IsAuthenticated(this ClaimsPrincipal user)
    {
        return user.Identity?.IsAuthenticated ?? false;
    }
}
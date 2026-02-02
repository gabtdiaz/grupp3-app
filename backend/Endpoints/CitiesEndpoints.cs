using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;

namespace grupp3_app.Api.Endpoints;

public static class CitiesEndpoints
{
    public static void MapCitiesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/cities").WithTags("Cities");

        // GET /api/cities - Hämta alla städer
        group.MapGet("/", async (ApplicationDbContext db) =>
        {
            var cities = await db.Cities
                .OrderBy(c => c.Name)
                .Select(c => new
                {
                    c.Id,
                    c.Name
                })
                .ToListAsync();

            return Results.Ok(cities);
        });
    }
}
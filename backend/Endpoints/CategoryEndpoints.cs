using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Data;

namespace grupp3_app.Api.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/categories").WithTags("Categories");

        // GET /api/categories - Hämta alla aktiva kategorier
        group.MapGet("/", async (ApplicationDbContext db) =>
        {
            var categories = await db.Categories
                .Where(c => c.IsActive)
                .OrderBy(c => c.SortOrder)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.DisplayName,
                    c.IconUrl
                })
                .ToListAsync();

            return Results.Ok(categories);
        });

        // GET /api/categories/{id} - Hämta en specifik kategori
        group.MapGet("/{id:int}", async (int id, ApplicationDbContext db) =>
        {
            var category = await db.Categories
                .Where(c => c.Id == id && c.IsActive)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.DisplayName,
                    c.IconUrl
                })
                .FirstOrDefaultAsync();

            if (category == null)
                return Results.NotFound(new { message = "Category not found" });

            return Results.Ok(category);
        });
    }
}
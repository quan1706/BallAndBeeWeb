using BallAndBeeWEB.Api.Data;
using BallAndBeeWEB.Api.DTOs;
using BallAndBeeWEB.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BallAndBeeWEB.Api.Endpoints
{
    public static class CategoryEndpoints
    {
        public static void MapCategoryEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/categories").WithTags("Categories");

            // GET /api/categories - Get root category tree (multi-level)
            group.MapGet("/", async (AppDbContext db) =>
            {
                var rootCategories = await db.Categories
                    .Include(c => c.Subcategories)
                        .ThenInclude(c => c.Subcategories)
                    .Where(c => c.ParentId == null)
                    .ToListAsync();

                var dtos = rootCategories.Select(MapCategoryToDto).ToList();
                return Results.Ok(dtos);
            })
            .WithName("GetAllCategories")
            .WithOpenApi();

            // GET /api/categories/{slug} - Get category details by slug
            group.MapGet("/{slug}", async (string slug, AppDbContext db) =>
            {
                var category = await db.Categories
                    .Include(c => c.Subcategories)
                    .FirstOrDefaultAsync(c => c.Slug == slug);

                if (category == null)
                {
                    return Results.NotFound(new { message = "Category not found" });
                }

                return Results.Ok(MapCategoryToDto(category));
            })
            .WithName("GetCategoryBySlug")
            .WithOpenApi();

            // POST /api/categories - Create category (Admin)
            group.MapPost("/", async (Category category, AppDbContext db) =>
            {
                // Ensure slug is unique
                if (await db.Categories.AnyAsync(c => c.Slug == category.Slug))
                {
                    return Results.BadRequest(new { message = "Slug already exists" });
                }

                db.Categories.Add(category);
                await db.SaveChangesAsync();

                return Results.Created($"/api/categories/{category.Slug}", MapCategoryToDto(category));
            })
            .WithName("CreateCategory")
            .WithOpenApi();

            // PUT /api/categories/{id} - Update category (Admin)
            group.MapPut("/{id:int}", async (int id, Category inputCategory, AppDbContext db) =>
            {
                var category = await db.Categories.FindAsync(id);
                if (category == null)
                {
                    return Results.NotFound(new { message = "Category not found" });
                }

                category.Name = inputCategory.Name;
                category.Slug = inputCategory.Slug;
                category.Color = inputCategory.Color;
                category.ParentId = inputCategory.ParentId;

                await db.SaveChangesAsync();
                return Results.Ok(MapCategoryToDto(category));
            })
            .WithName("UpdateCategory")
            .WithOpenApi();

            // DELETE /api/categories/{id} - Delete category (Admin)
            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var category = await db.Categories.FindAsync(id);
                if (category == null)
                {
                    return Results.NotFound(new { message = "Category not found" });
                }

                db.Categories.Remove(category);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Category deleted successfully" });
            })
            .WithName("DeleteCategory")
            .WithOpenApi();
        }

        private static CategoryDto MapCategoryToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Color = category.Color,
                ParentId = category.ParentId,
                Subcategories = category.Subcategories.Select(MapCategoryToDto).ToList()
            };
        }
    }
}

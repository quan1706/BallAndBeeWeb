using BallAndBeeWEB.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace BallAndBeeWEB.Api.Endpoints
{
    public static class AdminEndpoints
    {
        public static void MapAdminEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/admin").WithTags("Admin");

            // GET /api/admin/stats - Dashboard statistics summary
            group.MapGet("/stats", async (AppDbContext db) =>
            {
                var totalProducts = await db.Products.CountAsync();
                var totalCategories = await db.Categories.CountAsync();
                var totalBlogPosts = await db.BlogPosts.CountAsync();
                var featuredProducts = await db.Products.CountAsync(p => p.Featured);
                var newProducts = await db.Products.CountAsync(p => p.IsNew);
                var visibleProducts = await db.Products.CountAsync(p => p.Visible);

                return Results.Ok(new
                {
                    totalProducts,
                    totalCategories,
                    totalBlogPosts,
                    featuredProducts,
                    newProducts,
                    visibleProducts
                });
            })
            .WithName("GetAdminStats")
            .WithOpenApi();

            // GET /api/admin/recent-products - 5 most recent products for dashboard
            group.MapGet("/recent-products", async (AppDbContext db) =>
            {
                var products = await db.Products
                    .Include(p => p.Category)
                        .ThenInclude(c => c!.Parent)
                    .Where(p => p.Visible)
                    .OrderByDescending(p => p.Id)
                    .Take(5)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Image,
                        p.Featured,
                        p.IsNew,
                        p.Visible,
                        Category = p.Category != null
                            ? (p.Category.ParentId == null ? p.Category.Name : (p.Category.Parent != null ? p.Category.Parent.Name : p.Category.Name))
                            : ""
                    })
                    .ToListAsync();

                return Results.Ok(products);
            })
            .WithName("GetRecentProducts")
            .WithOpenApi();

            // GET /api/admin/category-stats - Product count per root category for pie chart
            group.MapGet("/category-stats", async (AppDbContext db) =>
            {
                var rootCategories = await db.Categories
                    .Where(c => c.ParentId == null)
                    .ToListAsync();

                // For each root category, count products in it and all its subcategories
                var result = new List<object>();

                foreach (var cat in rootCategories)
                {
                    // Get all descendant category IDs
                    var allDescendantIds = await GetAllDescendantIds(db, cat.Id);
                    allDescendantIds.Add(cat.Id);

                    var productCount = await db.Products
                        .CountAsync(p => allDescendantIds.Contains(p.CategoryId) && p.Visible);

                    result.Add(new
                    {
                        name = cat.Name,
                        slug = cat.Slug,
                        color = cat.Color,
                        value = productCount
                    });
                }

                return Results.Ok(result);
            })
            .WithName("GetCategoryStats")
            .WithOpenApi();
        }

        private static async Task<List<int>> GetAllDescendantIds(AppDbContext db, int parentId)
        {
            var directChildren = await db.Categories
                .Where(c => c.ParentId == parentId)
                .Select(c => c.Id)
                .ToListAsync();

            var allIds = new List<int>(directChildren);
            foreach (var childId in directChildren)
            {
                allIds.AddRange(await GetAllDescendantIds(db, childId));
            }

            return allIds;
        }
    }
}

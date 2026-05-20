using BallAndBeeWEB.Api.Data;
using BallAndBeeWEB.Api.DTOs;
using BallAndBeeWEB.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BallAndBeeWEB.Api.Endpoints
{
    public static class ProductEndpoints
    {
        public static void MapProductEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/products").WithTags("Products");

            // GET /api/products - Get list of products with filters
            group.MapGet("/", async (
                string? categorySlug,
                string? search,
                bool? featured,
                int? limit,
                AppDbContext db) =>
            {
                var query = db.Products
                    .Include(p => p.Category)
                        .ThenInclude(c => c!.Parent)
                    .Where(p => p.Visible);

                // Filter by category and its subcategories
                if (!string.IsNullOrEmpty(categorySlug))
                {
                    var targetCategory = await db.Categories
                        .Include(c => c.Subcategories)
                            .ThenInclude(c => c.Subcategories)
                        .FirstOrDefaultAsync(c => c.Slug == categorySlug);

                    if (targetCategory != null)
                    {
                        var categoryIds = GetCategoryAndSubcategoryIds(targetCategory);
                        query = query.Where(p => categoryIds.Contains(p.CategoryId));
                    }
                    else
                    {
                        // If category not found, return empty list
                        return Results.Ok(new List<ProductDto>());
                    }
                }

                // Filter by search text
                if (!string.IsNullOrEmpty(search))
                {
                    var searchLower = search.ToLower();
                    query = query.Where(p => p.Name.ToLower().Contains(searchLower) || 
                                             (p.Description != null && p.Description.ToLower().Contains(searchLower)));
                }

                // Filter by featured status
                if (featured.HasValue)
                {
                    query = query.Where(p => p.Featured == featured.Value);
                }

                // Apply limit
                if (limit.HasValue && limit.Value > 0)
                {
                    query = query.Take(limit.Value);
                }

                var products = await query.ToListAsync();
                var dtos = products.Select(MapProductToDto).ToList();
                return Results.Ok(dtos);
            })
            .WithName("GetProducts")
            .WithOpenApi();

            // GET /api/products/{slug} - Get product detail by slug
            group.MapGet("/{slug}", async (string slug, AppDbContext db) =>
            {
                var product = await db.Products
                    .Include(p => p.Category)
                        .ThenInclude(c => c!.Parent)
                    .FirstOrDefaultAsync(p => p.Slug == slug);

                if (product == null)
                {
                    return Results.NotFound(new { message = "Product not found" });
                }

                return Results.Ok(MapProductToDto(product));
            })
            .WithName("GetProductBySlug")
            .WithOpenApi();

            // POST /api/products - Create product (Admin)
            group.MapPost("/", async (Product product, AppDbContext db) =>
            {
                // Ensure slug is unique
                if (await db.Products.AnyAsync(p => p.Slug == product.Slug))
                {
                    return Results.BadRequest(new { message = "Slug already exists" });
                }

                // Verify category exists
                var category = await db.Categories.FindAsync(product.CategoryId);
                if (category == null)
                {
                    return Results.BadRequest(new { message = "Category does not exist" });
                }

                db.Products.Add(product);
                await db.SaveChangesAsync();

                // Reload product with relationships for DTO mapping
                var newProduct = await db.Products
                    .Include(p => p.Category)
                        .ThenInclude(c => c!.Parent)
                    .FirstAsync(p => p.Id == product.Id);

                return Results.Created($"/api/products/{product.Slug}", MapProductToDto(newProduct));
            })
            .WithName("CreateProduct")
            .WithOpenApi();

            // PUT /api/products/{id} - Update product (Admin)
            group.MapPut("/{id:int}", async (int id, Product inputProduct, AppDbContext db) =>
            {
                var product = await db.Products.FindAsync(id);
                if (product == null)
                {
                    return Results.NotFound(new { message = "Product not found" });
                }

                // Verify category exists if updated
                if (product.CategoryId != inputProduct.CategoryId)
                {
                    var category = await db.Categories.FindAsync(inputProduct.CategoryId);
                    if (category == null)
                    {
                        return Results.BadRequest(new { message = "Category does not exist" });
                    }
                    product.CategoryId = inputProduct.CategoryId;
                }

                product.Name = inputProduct.Name;
                product.Slug = inputProduct.Slug;
                product.Price = inputProduct.Price;
                product.Description = inputProduct.Description;
                product.Material = inputProduct.Material;
                product.Size = inputProduct.Size;
                product.Origin = inputProduct.Origin;
                product.Tags = inputProduct.Tags;
                product.Featured = inputProduct.Featured;
                product.IsNew = inputProduct.IsNew;
                product.Visible = inputProduct.Visible;
                product.Image = inputProduct.Image;

                await db.SaveChangesAsync();

                // Reload for proper DTO mapping
                var updatedProduct = await db.Products
                    .Include(p => p.Category)
                        .ThenInclude(c => c!.Parent)
                    .FirstAsync(p => p.Id == product.Id);

                return Results.Ok(MapProductToDto(updatedProduct));
            })
            .WithName("UpdateProduct")
            .WithOpenApi();

            // DELETE /api/products/{id} - Delete product (Admin)
            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var product = await db.Products.FindAsync(id);
                if (product == null)
                {
                    return Results.NotFound(new { message = "Product not found" });
                }

                db.Products.Remove(product);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Product deleted successfully" });
            })
            .WithName("DeleteProduct")
            .WithOpenApi();
        }

        private static List<int> GetCategoryAndSubcategoryIds(Category category)
        {
            var ids = new List<int> { category.Id };
            foreach (var sub in category.Subcategories)
            {
                ids.AddRange(GetCategoryAndSubcategoryIds(sub));
            }
            return ids.Distinct().ToList();
        }

        private static ProductDto MapProductToDto(Product product)
        {
            var directCategory = product.Category;
            string categoryName = "";
            string categorySlug = "";
            string? subcategoryName = null;

            if (directCategory != null)
            {
                if (directCategory.ParentId == null)
                {
                    // If Category has no parent, it is a Root Category
                    categoryName = directCategory.Name;
                    categorySlug = directCategory.Slug;
                }
                else
                {
                    // If Category has parent, it is a Subcategory
                    subcategoryName = directCategory.Name;
                    
                    var parentCategory = directCategory.Parent;
                    if (parentCategory != null)
                    {
                        categoryName = parentCategory.Name;
                        categorySlug = parentCategory.Slug;
                    }
                }
            }

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Slug = product.Slug,
                Category = categoryName,
                CategorySlug = categorySlug,
                Subcategory = subcategoryName,
                Description = product.Description,
                Material = product.Material,
                Size = product.Size,
                Origin = product.Origin,
                Tags = product.Tags,
                Featured = product.Featured,
                IsNew = product.IsNew,
                Visible = product.Visible,
                Image = product.Image
            };
        }
    }
}

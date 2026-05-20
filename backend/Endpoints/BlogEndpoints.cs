using BallAndBeeWEB.Api.Data;
using BallAndBeeWEB.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BallAndBeeWEB.Api.Endpoints
{
    public static class BlogEndpoints
    {
        public static void MapBlogEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/blog").WithTags("Blog");

            // GET /api/blog - Get list of blog posts
            group.MapGet("/", async (
                bool? featured,
                int? limit,
                AppDbContext db) =>
            {
                var query = db.BlogPosts.Where(b => b.Status == "published").OrderByDescending(b => b.Date).AsQueryable();

                if (featured.HasValue)
                {
                    query = query.Where(b => b.Featured == featured.Value);
                }

                if (limit.HasValue && limit.Value > 0)
                {
                    query = query.Take(limit.Value);
                }

                var posts = await query.ToListAsync();
                return Results.Ok(posts);
            })
            .WithName("GetBlogPosts")
            .WithOpenApi();

            // GET /api/blog/{slug} - Get blog post detail by slug
            group.MapGet("/{slug}", async (string slug, AppDbContext db) =>
            {
                var post = await db.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug);
                if (post == null)
                {
                    return Results.NotFound(new { message = "Blog post not found" });
                }

                return Results.Ok(post);
            })
            .WithName("GetBlogPostBySlug")
            .WithOpenApi();

            // POST /api/blog - Create blog post (Admin)
            group.MapPost("/", async (BlogPost post, AppDbContext db) =>
            {
                // Ensure slug is unique
                if (await db.BlogPosts.AnyAsync(b => b.Slug == post.Slug))
                {
                    return Results.BadRequest(new { message = "Slug already exists" });
                }

                db.BlogPosts.Add(post);
                await db.SaveChangesAsync();

                return Results.Created($"/api/blog/{post.Slug}", post);
            })
            .WithName("CreateBlogPost")
            .WithOpenApi();

            // PUT /api/blog/{id} - Update blog post (Admin)
            group.MapPut("/{id:int}", async (int id, BlogPost inputPost, AppDbContext db) =>
            {
                var post = await db.BlogPosts.FindAsync(id);
                if (post == null)
                {
                    return Results.NotFound(new { message = "Blog post not found" });
                }

                post.Title = inputPost.Title;
                post.Slug = inputPost.Slug;
                post.Topic = inputPost.Topic;
                post.TopicSlug = inputPost.TopicSlug;
                post.Excerpt = inputPost.Excerpt;
                post.Content = inputPost.Content;
                post.ReadTime = inputPost.ReadTime;
                post.Image = inputPost.Image;
                post.Featured = inputPost.Featured;
                post.Status = inputPost.Status;

                await db.SaveChangesAsync();
                return Results.Ok(post);
            })
            .WithName("UpdateBlogPost")
            .WithOpenApi();

            // DELETE /api/blog/{id} - Delete blog post (Admin)
            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var post = await db.BlogPosts.FindAsync(id);
                if (post == null)
                {
                    return Results.NotFound(new { message = "Blog post not found" });
                }

                db.BlogPosts.Remove(post);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Blog post deleted successfully" });
            })
            .WithName("DeleteBlogPost")
            .WithOpenApi();
        }
    }
}

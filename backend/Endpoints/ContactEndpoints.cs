using BallAndBeeWEB.Api.Data;
using BallAndBeeWEB.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BallAndBeeWEB.Api.Endpoints
{
    public static class ContactEndpoints
    {
        public static void MapContactEndpoints(this IEndpointRouteBuilder routes)
        {
            // Public endpoint
            routes.MapPost("/api/contact", async (ContactMessage message, AppDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(message.Name) || string.IsNullOrWhiteSpace(message.Phone) || string.IsNullOrWhiteSpace(message.Message))
                {
                    return Results.BadRequest(new { message = "Name, Phone and Message are required." });
                }

                message.SentAt = DateTime.UtcNow;
                message.IsRead = false;

                db.ContactMessages.Add(message);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Contact message sent successfully.", data = message });
            })
            .WithName("CreateContactMessage")
            .WithOpenApi()
            .WithTags("Contact");

            // Admin endpoints group
            var adminGroup = routes.MapGroup("/api/admin/contacts").WithTags("Admin Contact Messages");

            // GET /api/admin/contacts - Get all messages sorted by newest
            adminGroup.MapGet("/", async (AppDbContext db) =>
            {
                var messages = await db.ContactMessages
                    .OrderByDescending(m => m.SentAt)
                    .ToListAsync();

                return Results.Ok(messages);
            })
            .WithName("GetAllContactMessages")
            .WithOpenApi();

            // PUT /api/admin/contacts/{id}/read - Mark message as read
            adminGroup.MapPut("/{id:int}/read", async (int id, AppDbContext db) =>
            {
                var message = await db.ContactMessages.FindAsync(id);
                if (message == null)
                {
                    return Results.NotFound(new { message = "Contact message not found." });
                }

                message.IsRead = true;
                await db.SaveChangesAsync();

                return Results.Ok(message);
            })
            .WithName("MarkContactMessageAsRead")
            .WithOpenApi();
        }
    }
}

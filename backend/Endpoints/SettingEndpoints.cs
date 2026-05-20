using BallAndBeeWEB.Api.Data;
using BallAndBeeWEB.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BallAndBeeWEB.Api.Endpoints
{
    public static class SettingEndpoints
    {
        public static void MapSettingEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/settings").WithTags("Settings");

            // GET /api/settings - Get current settings
            group.MapGet("/", async (AppDbContext db) =>
            {
                var settings = await db.SystemSettings.FirstOrDefaultAsync();
                if (settings == null)
                {
                    // Create default settings if not exists
                    settings = new SystemSetting
                    {
                        Name = "BALLANDBEEHOME",
                        Tagline = "Không gian sống - Tinh tế từng chi tiết",
                        Description = "Chúng tôi tạo ra những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt hiện đại.",
                        Phone = "0901 234 567",
                        Zalo = "0901 234 567",
                        Email = "hello@ballandbeehome.com",
                        Address = "123 Nguyễn Văn Linh, Đà Nẵng",
                        Hours = "Thứ 2–7, 8:00–18:00",
                        Facebook = "https://facebook.com/ballandbeehome",
                        Instagram = "https://instagram.com/ballandbeehome",
                        Tiktok = "https://tiktok.com/@ballandbeehome",
                        GoogleMapsEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8983128073786!2d108.21992687589745!3d16.072661884621964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c8b5cf238f%3A0x69a4f8e9eae7ec0f!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                    };
                    db.SystemSettings.Add(settings);
                    await db.SaveChangesAsync();
                }

                return Results.Ok(settings);
            })
            .WithName("GetSettings")
            .WithOpenApi();

            // PUT /api/settings - Update settings (Admin)
            group.MapPut("/", async (SystemSetting inputSettings, AppDbContext db) =>
            {
                var settings = await db.SystemSettings.FirstOrDefaultAsync();
                if (settings == null)
                {
                    settings = new SystemSetting();
                    db.SystemSettings.Add(settings);
                }

                settings.Name = inputSettings.Name;
                settings.Tagline = inputSettings.Tagline;
                settings.Description = inputSettings.Description;
                settings.Phone = inputSettings.Phone;
                settings.Zalo = inputSettings.Zalo;
                settings.Email = inputSettings.Email;
                settings.Address = inputSettings.Address;
                settings.Hours = inputSettings.Hours;
                settings.Facebook = inputSettings.Facebook;
                settings.Instagram = inputSettings.Instagram;
                settings.Tiktok = inputSettings.Tiktok;
                settings.GoogleMapsEmbed = inputSettings.GoogleMapsEmbed;

                await db.SaveChangesAsync();
                return Results.Ok(settings);
            })
            .WithName("UpdateSettings")
            .WithOpenApi();
        }
    }
}

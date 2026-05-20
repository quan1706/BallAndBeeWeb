using System.ComponentModel.DataAnnotations;

namespace BallAndBeeWEB.Api.Models
{
    public class SystemSetting
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "BALL & BEE";

        public string? Tagline { get; set; }

        public string? Description { get; set; }

        public string? Phone { get; set; }

        public string? Zalo { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public string? Hours { get; set; }

        public string? Facebook { get; set; }

        public string? Instagram { get; set; }

        public string? Tiktok { get; set; }

        public string? GoogleMapsEmbed { get; set; }
    }
}

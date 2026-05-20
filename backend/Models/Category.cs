using System.Text.Json.Serialization;

namespace BallAndBeeWEB.Api.Models
{
    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }
        public string? Color { get; set; }
        public int? ParentId { get; set; }

        // Navigation properties
        [JsonIgnore]
        public Category? Parent { get; set; }
        
        public ICollection<Category> Subcategories { get; set; } = new List<Category>();
        
        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}

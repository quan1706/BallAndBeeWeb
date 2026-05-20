namespace BallAndBeeWEB.Api.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string Slug { get; set; }
        public required string Category { get; set; }
        public required string CategorySlug { get; set; }
        public string? Subcategory { get; set; }
        public string? Description { get; set; }
        public string? Material { get; set; }
        public string? Size { get; set; }
        public string? Origin { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public bool Featured { get; set; }
        public bool IsNew { get; set; }
        public bool Visible { get; set; }
        public string? Image { get; set; }
    }
}

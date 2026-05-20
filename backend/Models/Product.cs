namespace BallAndBeeWEB.Api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public string? Material { get; set; }
        public string? Size { get; set; }
        public string? Origin { get; set; }
        
        // Postgres text[] array mapping, supported natively in EF Core 8
        public List<string> Tags { get; set; } = new List<string>();
        
        public bool Featured { get; set; } = false;
        public bool IsNew { get; set; } = true;
        public bool Visible { get; set; } = true;
        public string? Image { get; set; }

        // Foreign key
        public int CategoryId { get; set; }
        
        // Navigation property
        public Category? Category { get; set; }
    }
}

namespace BallAndBeeWEB.Api.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }
        public string? Color { get; set; }
        public int? ParentId { get; set; }
        public List<CategoryDto> Subcategories { get; set; } = new List<CategoryDto>();
    }
}

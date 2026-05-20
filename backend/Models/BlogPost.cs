namespace BallAndBeeWEB.Api.Models
{
    public class BlogPost
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Slug { get; set; }
        public required string Topic { get; set; }
        public required string TopicSlug { get; set; }
        public string? Excerpt { get; set; }
        public string? Content { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? ReadTime { get; set; }
        public string? Image { get; set; }
        public bool Featured { get; set; } = false;
        public string Status { get; set; } = "published";
    }
}

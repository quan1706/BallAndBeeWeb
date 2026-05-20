using System.Security.Cryptography;
using System.Text;

namespace BallAndBeeWEB.Api.Endpoints
{
    public static class ImageKitEndpoints
    {
        public static void MapImageKitEndpoints(this IEndpointRouteBuilder routes)
        {
            // GET /api/imagekit/auth - Generate upload authentication signature
            // Frontend calls this before each upload to get a secure signature
            routes.MapGet("/api/imagekit/auth", (IConfiguration configuration) =>
            {
                var privateKey = configuration["ImageKit:PrivateKey"];

                if (string.IsNullOrEmpty(privateKey))
                {
                    return Results.BadRequest(new { message = "ImageKit PrivateKey is not configured." });
                }

                var token = Guid.NewGuid().ToString();

                // Expiration: 30 minutes from now
                var expire = DateTimeOffset.UtcNow.AddMinutes(30).ToUnixTimeSeconds().ToString();

                // Compute HMAC-SHA1 signature as required by ImageKit
                var input = token + expire;
                string signature;

                using (var hmac = new HMACSHA1(Encoding.UTF8.GetBytes(privateKey)))
                {
                    var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
                    signature = BitConverter.ToString(hash).Replace("-", "").ToLower();
                }

                return Results.Ok(new
                {
                    token,
                    expire = long.Parse(expire),
                    signature
                });
            })
            .WithName("GetImageKitAuth")
            .WithTags("ImageKit")
            .WithOpenApi();

            // GET /api/imagekit/config - Return public configuration for frontend
            // Safe to expose: only publicKey and urlEndpoint (never privateKey)
            routes.MapGet("/api/imagekit/config", (IConfiguration configuration) =>
            {
                return Results.Ok(new
                {
                    urlEndpoint = configuration["ImageKit:UrlEndpoint"],
                    publicKey = configuration["ImageKit:PublicKey"],
                    // Folder structure: /ballandbee/products, /ballandbee/blog, etc.
                    defaultFolder = "/ballandbee"
                });
            })
            .WithName("GetImageKitConfig")
            .WithTags("ImageKit")
            .WithOpenApi();
        }
    }
}

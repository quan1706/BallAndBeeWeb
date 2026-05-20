using BallAndBeeWEB.Api.Data;
using BallAndBeeWEB.Api.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure PostgreSQL Database Connection via EF Core (Priority: Environment Variable -> appsettings.json)
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Configure CORS to allow frontend Next.js requests (both local and deployed on Vercel)
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // Allow any origin to prevent CORS blocking on Vercel
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. Auto Database Migration and Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration or seeding.");
    }
}

// 4. Configure HTTP request pipeline (Enable Swagger UI globally for API testing on Cloud)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ball & Bee API v1");
    c.RoutePrefix = "swagger"; // Access Swagger UI at /swagger
});

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

// 5. Register Endpoints
app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }))
   .WithName("GetHealth")
   .WithOpenApi();

app.MapCategoryEndpoints();
app.MapProductEndpoints();
app.MapBlogEndpoints();
app.MapImageKitEndpoints();
app.MapAdminEndpoints();
app.MapSettingEndpoints();
app.MapContactEndpoints();

app.Run();

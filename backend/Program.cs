using grupp3_app.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using grupp3_app.Api.Data;
using grupp3_app.Api.Endpoints;
using grupp3_app.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();

// Application Insights
builder.Services.AddApplicationInsightsTelemetry();

// Register services
builder.Services.AddScoped<ITokenService, TokenService>();

// Database 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            builder.Configuration["JwtSettings:TokenKey"]!)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5011")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(
                "https://friendzone.azurewebsites.net",
                "https://www.friendzone.azurewebsites.net"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        }
    });
});

// Swagger
builder.Services.AddSwaggerWithAuth();

// Rate Limiting
builder.Services.AddRateLimiting(builder.Configuration);

// Event Restriction Services
builder.Services.AddScoped<AgeValidationService>();
builder.Services.AddScoped<EventRestrictionService>();

// JSON serialization - fix circular reference crash when serializing EF navigation properties
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// HSTS (production only)
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

// CORS (bara i development)
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowFrontend");
}

app.UseRateLimiting();
app.UseSecurityHeaders();
app.UseAuthentication();
app.UseAuthorization();

// Servera statiska filer (React-appen från wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

// Map endpoints
app.MapAuthEndpoints();
app.MapEventEndpoints();
app.MapCategoryEndpoints();
app.MapEventParticipationEndpoints();
app.MapProfileEndpoints();
app.MapCommentEndpoints();
app.MapCitiesEndpoints();
app.MapHealthChecks("/health");

app.MapFallbackToFile("index.html");  // React Router fallback

app.Run();
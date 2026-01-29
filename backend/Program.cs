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

// Register services
builder.Services.AddScoped<ITokenService, TokenService>();

// Database 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    // Rules for token validation
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
            policy.SetIsOriginAllowed(_ => true)  // Tillåt alla origins i dev
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            policy.WithOrigins("https://friendzone-app.azurewebsites.net")
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
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
app.MapEventParticipationEndpoints();
app.MapProfileEndpoints();
app.MapCommentEndpoints();


app.MapFallbackToFile("index.html");  // React Router fallback

app.Run();

using Microsoft.EntityFrameworkCore;
using SWP_abschluss_projekt.Models;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ✅ Dienste registrieren
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Fix: Zirkuläre Referenzen ignorieren (Klasse → Lehrer → KlassenAlsKV → Klasse...)
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// ✅ DbContext konfigurieren
builder.Services.AddDbContext<SchulDbContext>(options =>
    options.UseSqlite("Data Source=schule.db"));

// ✅ Swagger aktivieren
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Schul-API",
        Version = "v1",
        Description = "Eine REST API zur Verwaltung von Schülern, Lehrern und Klassen"
    });
});

// ✅ CORS aktivieren (Richtig platziert)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ✅ Swagger Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Schul-API V1");
    });
}

// ✅ HTTPS & CORS
app.UseHttpsRedirection();
app.UseCors("AllowAll"); // Muss VOR Authorization kommen

app.UseAuthorization();
app.MapControllers();

app.Run();

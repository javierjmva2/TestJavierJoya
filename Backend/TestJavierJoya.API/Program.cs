
using System.Text;
using Serilog;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TestJavierJoya.API.Middleware;
using TestJavierJoya.Application.Interfaces;
using TestJavierJoya.Application.Mappings;
using TestJavierJoya.Application.Services;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Interfaces;
using TestJavierJoya.Domain.Repositories;
using TestJavierJoya.Infrastructure.Config;
using TestJavierJoya.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configuración Serilog
builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration));

// Configuración Mongo
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

//Configuración JWT
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

//Inyecciones
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<TestJavierJoya.Application.Interfaces.IAuthenticationService, TestJavierJoya.Application.Services.AuthenticationService>();
builder.Services.AddScoped<IOwnerAppService, OwnerAppService>();
builder.Services.AddScoped<IPropertyAppService, PropertyAppService>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);


// JWT Auth
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

if (jwtSettings is null)
    throw new ArgumentNullException($"{nameof(jwtSettings)} no está configurado.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
        ValidateLifetime = true
    };
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Tu API", Version = "v1" });

    // Configurar esquema de seguridad
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingresa el token JWT con el formato: Bearer {token}"
    });

    // Aplicar el esquema globalmente
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(name: "AllowAll",
                          policy =>
                          {
                              policy.AllowAnyOrigin();
                              policy.AllowAnyMethod();
                              policy.AllowAnyHeader();
                          });
    });

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization(); ;
app.MapControllers();

app.Run();




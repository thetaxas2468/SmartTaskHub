using Microsoft.Extensions.Options;
using SmartTaskHub.Api.Options;
using SmartTaskHub.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddOptions<MongoOptions>()
    .Bind(builder.Configuration.GetSection("Mongo"))
    .Validate(o => !string.IsNullOrWhiteSpace(o.ConnectionString), "Mongo:ConnectionString is required.")
    .Validate(o => !string.IsNullOrWhiteSpace(o.DatabaseName), "Mongo:DatabaseName is required.")
    .ValidateOnStart();

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<TasksService>();
builder.Services.AddScoped<HabitsService>();
builder.Services.AddScoped<NotesService>();
builder.Services.AddScoped<DashboardService>();

const string CorsPolicyName = "AngularDev";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>();
        policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(CorsPolicyName);

app.MapControllers();

app.Run();

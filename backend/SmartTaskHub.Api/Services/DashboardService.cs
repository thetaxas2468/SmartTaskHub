using MongoDB.Driver;
using SmartTaskHub.Api.Models;

namespace SmartTaskHub.Api.Services;

public sealed class DashboardService
{
    private readonly MongoDbContext _db;

    public DashboardService(MongoDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardStats> GetStatsAsync(CancellationToken ct = default)
    {
        var todayUtc = DateTime.UtcNow.Date;

        var totalTasks = await _db.Tasks.CountDocumentsAsync(Builders<TaskItem>.Filter.Empty, cancellationToken: ct);
        var completedTasks = await _db.Tasks.CountDocumentsAsync(t => t.Completed, cancellationToken: ct);

        var habitsDoc = await _db.Habits.Find(d => d.Id == "default").FirstOrDefaultAsync(ct);
        var totalDaysTracked = habitsDoc?.Entries?.Count ?? 0;

        var totalNotes = await _db.Notes.CountDocumentsAsync(Builders<Note>.Filter.Empty, cancellationToken: ct);

        return new DashboardStats
        {
            TodayUtc = todayUtc,
            TotalTasks = totalTasks,
            CompletedTasks = completedTasks,
            TotalDaysTracked = totalDaysTracked,
            TotalNotes = totalNotes
        };
    }
}

public sealed class DashboardStats
{
    public DateTime TodayUtc { get; init; }
    public long TotalTasks { get; init; }
    public long CompletedTasks { get; init; }
    public int TotalDaysTracked { get; init; }

    public long TotalNotes { get; init; }
}


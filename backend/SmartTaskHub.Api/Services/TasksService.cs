using MongoDB.Driver;
using SmartTaskHub.Api.Models;

namespace SmartTaskHub.Api.Services;

public sealed class TasksService
{
    private readonly MongoDbContext _db;

    public TasksService(MongoDbContext db)
    {
        _db = db;
    }

    public async Task<List<TaskItem>> GetAllAsync(bool? completed = null, CancellationToken ct = default)
    {
        var filter = Builders<TaskItem>.Filter.Empty;
        if (completed is not null)
        {
            filter = Builders<TaskItem>.Filter.Eq(t => t.Completed, completed.Value);
        }

        return await _db.Tasks.Find(filter).SortByDescending(t => t.Id).ToListAsync(ct);
    }

    public async Task<TaskItem?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _db.Tasks.Find(t => t.Id == id).FirstOrDefaultAsync(ct);
    }

    public async Task<TaskItem> CreateAsync(TaskItem task, CancellationToken ct = default)
    {
        // Client supplies Id (matches current Angular behavior).
        await _db.Tasks.InsertOneAsync(task, cancellationToken: ct);
        return task;
    }

    public async Task<bool> ReplaceAsync(int id, TaskItem updated, CancellationToken ct = default)
    {
        updated.Id = id;
        var result = await _db.Tasks.ReplaceOneAsync(t => t.Id == id, updated, cancellationToken: ct);
        return result.MatchedCount == 1;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var result = await _db.Tasks.DeleteOneAsync(t => t.Id == id, ct);
        return result.DeletedCount == 1;
    }
}


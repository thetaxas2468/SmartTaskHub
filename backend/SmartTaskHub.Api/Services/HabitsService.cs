using MongoDB.Driver;
using SmartTaskHub.Api.Models;

namespace SmartTaskHub.Api.Services;

public sealed class HabitsService
{
    private readonly MongoDbContext _db;
    private const string DocId = "default";

    public HabitsService(MongoDbContext db)
    {
        _db = db;
    }

    public async Task<HabitsDocument> GetAsync(CancellationToken ct = default)
    {
        var doc = await _db.Habits.Find(d => d.Id == DocId).FirstOrDefaultAsync(ct);
        if (doc is not null) return doc;

        var created = new HabitsDocument { Id = DocId };
        await _db.Habits.InsertOneAsync(created, cancellationToken: ct);
        return created;
    }

    public async Task<HabitEntry?> GetEntryAsync(string date, CancellationToken ct = default)
    {
        var doc = await GetAsync(ct);
        return doc.Entries.FirstOrDefault(e => e.Date == date);
    }

    public async Task<HabitsDocument> ReplaceAsync(HabitsDocument updated, CancellationToken ct = default)
    {
        updated.Id = DocId;
        updated.Targets ??= new HabitTargets();
        updated.Entries ??= new List<HabitEntry>();
        await _db.Habits.ReplaceOneAsync(d => d.Id == DocId, updated, new ReplaceOptions { IsUpsert = true }, ct);
        return updated;
    }

    public async Task<HabitsDocument> UpsertEntryAsync(HabitEntry entry, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(entry.Date))
            throw new ArgumentException("Entry date is required (YYYY-MM-DD).", nameof(entry));

        var doc = await GetAsync(ct);
        doc.Targets ??= new HabitTargets();
        doc.Entries ??= new List<HabitEntry>();

        var idx = doc.Entries.FindIndex(e => e.Date == entry.Date);
        if (idx >= 0) doc.Entries[idx] = entry;
        else doc.Entries.Add(entry);

        await _db.Habits.ReplaceOneAsync(d => d.Id == DocId, doc, new ReplaceOptions { IsUpsert = true }, ct);
        return doc;
    }
}


using MongoDB.Driver;
using SmartTaskHub.Api.Models;

namespace SmartTaskHub.Api.Services;

public sealed class NotesService
{
    private readonly MongoDbContext _db;

    public NotesService(MongoDbContext db)
    {
        _db = db;
    }

    public async Task<List<Note>> GetAllAsync(string? search = null, CancellationToken ct = default)
    {
        var filter = Builders<Note>.Filter.Empty;
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            filter = Builders<Note>.Filter.Or(
                Builders<Note>.Filter.Regex(n => n.Title, new MongoDB.Bson.BsonRegularExpression(s, "i")),
                Builders<Note>.Filter.Regex(n => n.Content, new MongoDB.Bson.BsonRegularExpression(s, "i"))
            );
        }

        return await _db.Notes.Find(filter).SortByDescending(n => n.UpdatedAtUtc).ToListAsync(ct);
    }

    public async Task<Note?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        return await _db.Notes.Find(n => n.Id == id).FirstOrDefaultAsync(ct);
    }

    public async Task<Note> CreateAsync(Note note, CancellationToken ct = default)
    {
        note.Id = null;
        note.Tags ??= new();
        note.CreatedAtUtc = DateTime.UtcNow;
        note.UpdatedAtUtc = DateTime.UtcNow;
        await _db.Notes.InsertOneAsync(note, cancellationToken: ct);
        return note;
    }

    public async Task<bool> ReplaceAsync(string id, Note updated, CancellationToken ct = default)
    {
        updated.Id = id;
        updated.Tags ??= new();
        updated.UpdatedAtUtc = DateTime.UtcNow;
        var result = await _db.Notes.ReplaceOneAsync(n => n.Id == id, updated, cancellationToken: ct);
        return result.MatchedCount == 1;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct = default)
    {
        var result = await _db.Notes.DeleteOneAsync(n => n.Id == id, ct);
        return result.DeletedCount == 1;
    }
}


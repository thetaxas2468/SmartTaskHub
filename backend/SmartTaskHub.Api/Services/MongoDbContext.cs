using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SmartTaskHub.Api.Models;
using SmartTaskHub.Api.Options;

namespace SmartTaskHub.Api.Services;

public sealed class MongoDbContext
{
    private readonly IMongoDatabase _db;

    public MongoDbContext(IOptions<MongoOptions> options)
    {
        var mongo = options.Value;
        var client = new MongoClient(mongo.ConnectionString);
        _db = client.GetDatabase(mongo.DatabaseName);
    }

    public IMongoCollection<TaskItem> Tasks => _db.GetCollection<TaskItem>("tasks");
    public IMongoCollection<HabitsDocument> Habits => _db.GetCollection<HabitsDocument>("habits");
    public IMongoCollection<Note> Notes => _db.GetCollection<Note>("notes");
}


using MongoDB.Bson.Serialization.Attributes;

namespace SmartTaskHub.Api.Models;

public sealed class TaskItem
{
    [BsonId]
    public int Id { get; set; }

    public string Title { get; set; } = "";
    public bool Completed { get; set; }
    public string Priority { get; set; } = "medium"; // high | medium | low
}


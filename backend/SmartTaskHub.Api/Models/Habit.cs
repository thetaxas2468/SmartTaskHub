using MongoDB.Bson.Serialization.Attributes;

namespace SmartTaskHub.Api.Models;

public sealed class HabitsDocument
{
    [BsonId]
    public string Id { get; set; } = "default";

    public HabitTargets Targets { get; set; } = new();
    public List<HabitEntry> Entries { get; set; } = new();
}

public sealed class HabitTargets
{
    public int WaterIntake { get; set; } = 8;
    public int Exercise { get; set; } = 30;
    public int Reading { get; set; } = 60;
}

public sealed class HabitEntry
{
    // Format: YYYY-MM-DD
    public string Date { get; set; } = "";
    public int WaterIntake { get; set; }
    public int Exercise { get; set; }
    public int Reading { get; set; }
}


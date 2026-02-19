namespace SmartTaskHub.Api.Options;

public sealed class MongoOptions
{
    public string ConnectionString { get; init; } = "";
    public string DatabaseName { get; init; } = "SmartTaskHub";
}


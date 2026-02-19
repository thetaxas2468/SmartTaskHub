using Microsoft.AspNetCore.Mvc;
using SmartTaskHub.Api.Models;
using SmartTaskHub.Api.Services;

namespace SmartTaskHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HabitsController : ControllerBase
{
    private readonly HabitsService _habits;

    public HabitsController(HabitsService habits)
    {
        _habits = habits;
    }

    [HttpGet]
    public async Task<ActionResult<HabitsDocument>> Get(CancellationToken ct)
    {
        return await _habits.GetAsync(ct);
    }

    [HttpGet("entries/{date}")]
    public async Task<ActionResult<HabitEntry>> GetEntry(string date, CancellationToken ct)
    {
        var entry = await _habits.GetEntryAsync(date, ct);
        return entry is null ? NotFound() : entry;
    }

    [HttpPut]
    public async Task<ActionResult<HabitsDocument>> Replace([FromBody] HabitsDocument doc, CancellationToken ct)
    {
        var updated = await _habits.ReplaceAsync(doc, ct);
        return Ok(updated);
    }

    [HttpPost("entries")]
    public async Task<ActionResult<HabitsDocument>> UpsertEntry([FromBody] HabitEntry entry, CancellationToken ct)
    {
        try
        {
            var doc = await _habits.UpsertEntryAsync(entry, ct);
            return Ok(doc);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}


using Microsoft.AspNetCore.Mvc;
using SmartTaskHub.Api.Models;
using SmartTaskHub.Api.Services;

namespace SmartTaskHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class NotesController : ControllerBase
{
    private readonly NotesService _notes;

    public NotesController(NotesService notes)
    {
        _notes = notes;
    }

    [HttpGet]
    public async Task<ActionResult<List<Note>>> GetAll([FromQuery] string? search, CancellationToken ct)
    {
        return await _notes.GetAllAsync(search, ct);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Note>> GetById(string id, CancellationToken ct)
    {
        var note = await _notes.GetByIdAsync(id, ct);
        return note is null ? NotFound() : note;
    }

    [HttpPost]
    public async Task<ActionResult<Note>> Create([FromBody] Note note, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(note.Title))
            return BadRequest(new { message = "Title is required." });

        var created = await _notes.CreateAsync(note, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Replace(string id, [FromBody] Note note, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(note.Title))
            return BadRequest(new { message = "Title is required." });

        var ok = await _notes.ReplaceAsync(id, note, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var ok = await _notes.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}


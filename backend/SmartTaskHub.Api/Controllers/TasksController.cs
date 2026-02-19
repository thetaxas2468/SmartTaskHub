using Microsoft.AspNetCore.Mvc;
using SmartTaskHub.Api.Models;
using SmartTaskHub.Api.Services;

namespace SmartTaskHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TasksController : ControllerBase
{
    private readonly TasksService _tasks;

    public TasksController(TasksService tasks)
    {
        _tasks = tasks;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskItem>>> GetAll([FromQuery] bool? completed, CancellationToken ct)
    {
        return await _tasks.GetAllAsync(completed, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> GetById(int id, CancellationToken ct)
    {
        var task = await _tasks.GetByIdAsync(id, ct);
        return task is null ? NotFound() : task;
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> Create([FromBody] TaskItem task, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(task.Title))
            return BadRequest(new { message = "Title is required." });

        var created = await _tasks.CreateAsync(task, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Replace(int id, [FromBody] TaskItem task, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(task.Title))
            return BadRequest(new { message = "Title is required." });

        var ok = await _tasks.ReplaceAsync(id, task, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var ok = await _tasks.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}


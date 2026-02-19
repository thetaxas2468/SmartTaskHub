using Microsoft.AspNetCore.Mvc;
using SmartTaskHub.Api.Services;

namespace SmartTaskHub.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public sealed class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboard;

    public DashboardController(DashboardService dashboard)
    {
        _dashboard = dashboard;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStats>> GetStats(CancellationToken ct)
    {
        return await _dashboard.GetStatsAsync(ct);
    }
}


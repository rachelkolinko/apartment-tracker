using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApartmentTracker.Api.Data;
using ApartmentTracker.Api.Dtos;

namespace ApartmentTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StatsController(AppDbContext db) { _db = db; }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStats>> GetDashboard()
    {
        var apartments = await _db.Apartments
            .Where(a => a.UserId == CurrentUserId)
            .ToListAsync();

        var statusBreakdown = apartments
            .GroupBy(a => a.Status)
            .Select(g => new StatusCount { Status = g.Key, Count = g.Count() })
            .ToList();

        var neighborhoodStats = apartments
            .Where(a => !string.IsNullOrWhiteSpace(a.Neighborhood))
            .GroupBy(a => a.Neighborhood)
            .Select(g => new NeighborhoodStats
            {
                Neighborhood = g.Key,
                AveragePrice = Math.Round(g.Average(a => a.Price), 0),
                Count = g.Count()
            })
            .OrderByDescending(s => s.Count)
            .ToList();

        var perWeek = apartments
            .GroupBy(a => StartOfWeek(a.CreatedAt))
            .Select(g => new WeeklyCount { WeekStart = g.Key, Count = g.Count() })
            .OrderBy(w => w.WeekStart)
            .ToList();

        int duration = 0;
        if (apartments.Count > 0)
        {
            var first = apartments.Min(a => a.CreatedAt);
            duration = (int)(DateTime.UtcNow - first).TotalDays;
        }

        return new DashboardStats
        {
            TotalApartments = apartments.Count,
            StatusBreakdown = statusBreakdown,
            AveragePriceByNeighborhood = neighborhoodStats,
            ApartmentsPerWeek = perWeek,
            SearchDurationDays = duration
        };
    }

    // שבוע מתחיל ביום ראשון (ישראלי)
    private static DateTime StartOfWeek(DateTime date)
    {
        var diff = (7 + (date.DayOfWeek - DayOfWeek.Sunday)) % 7;
        return date.AddDays(-diff).Date;
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApartmentTracker.Api.Data;
using ApartmentTracker.Api.Dtos;
using ApartmentTracker.Api.Models;

namespace ApartmentTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VisitsController : ControllerBase
{
    private readonly AppDbContext _db;

    public VisitsController(AppDbContext db) { _db = db; }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<ActionResult<Visit>> Create(CreateVisitRequest req)
    {
        // ודאי שהדירה קיימת ושייכת למשתמש הנוכחי
        var apt = await _db.Apartments
            .FirstOrDefaultAsync(a => a.Id == req.ApartmentId && a.UserId == CurrentUserId);

        if (apt == null) return NotFound("Apartment not found");

        if (req.Rating < 1 || req.Rating > 5)
            return BadRequest("Rating must be between 1 and 5");

        var visit = new Visit
        {
            ApartmentId = req.ApartmentId,
            VisitDate = req.VisitDate,
            Rating = req.Rating,
            Notes = req.Notes
        };

        _db.Visits.Add(visit);
        await _db.SaveChangesAsync();
        return visit;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var visit = await _db.Visits
            .Include(v => v.Apartment)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (visit == null) return NotFound();
        if (visit.Apartment.UserId != CurrentUserId) return Forbid();

        _db.Visits.Remove(visit);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
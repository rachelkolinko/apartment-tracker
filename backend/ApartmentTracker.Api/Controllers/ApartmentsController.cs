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
public class ApartmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ApartmentsController(AppDbContext db) { _db = db; }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Apartment>>> GetAll()
    {
        return await _db.Apartments
            .Where(a => a.UserId == CurrentUserId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Apartment>> GetOne(int id)
    {
        var apt = await _db.Apartments
            .Include(a => a.Visits)
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);

        if (apt == null) return NotFound();
        return apt;
    }

    [HttpPost]
    public async Task<ActionResult<Apartment>> Create(CreateApartmentRequest req)
    {
        var apt = new Apartment
        {
            Neighborhood = req.Neighborhood,
            Address = req.Address,
            Rooms = req.Rooms,
            SizeSqm = req.SizeSqm,
            Price = req.Price,
            Status = req.Status,
            ContactName = req.ContactName,
            ContactPhone = req.ContactPhone,
            ListingUrl = req.ListingUrl,
            Notes = req.Notes,
            UserId = CurrentUserId
        };

        _db.Apartments.Add(apt);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne), new { id = apt.Id }, apt);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateApartmentRequest req)
    {
        var apt = await _db.Apartments
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);

        if (apt == null) return NotFound();

        apt.Neighborhood = req.Neighborhood;
        apt.Address = req.Address;
        apt.Rooms = req.Rooms;
        apt.SizeSqm = req.SizeSqm;
        apt.Price = req.Price;
        apt.Status = req.Status;
        apt.ContactName = req.ContactName;
        apt.ContactPhone = req.ContactPhone;
        apt.ListingUrl = req.ListingUrl;
        apt.Notes = req.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateStatusRequest req)
    {
        var apt = await _db.Apartments
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);

        if (apt == null) return NotFound();

        apt.Status = req.Status;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var apt = await _db.Apartments
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);

        if (apt == null) return NotFound();

        _db.Apartments.Remove(apt);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
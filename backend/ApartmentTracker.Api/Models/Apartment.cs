namespace ApartmentTracker.Api.Models;

public enum ApartmentStatus
{
    Interested,
    Visited,
    PendingResponse,
    Rejected,
    GotIt
}

public class Apartment
{
    public int Id { get; set; }
    public string Neighborhood { get; set; } = "";
    public string Address { get; set; } = "";
    public int Rooms { get; set; }
    public int SizeSqm { get; set; }
    public decimal Price { get; set; }
    public ApartmentStatus Status { get; set; } = ApartmentStatus.Interested;
    public string ContactName { get; set; } = "";
    public string ContactPhone { get; set; } = "";
    public string ListingUrl { get; set; } = "";
    public string Notes { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public List<Visit> Visits { get; set; } = new();
}
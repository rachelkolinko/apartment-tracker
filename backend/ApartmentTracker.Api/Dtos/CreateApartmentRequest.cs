using ApartmentTracker.Api.Models;

namespace ApartmentTracker.Api.Dtos;

public class CreateApartmentRequest
{
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
}
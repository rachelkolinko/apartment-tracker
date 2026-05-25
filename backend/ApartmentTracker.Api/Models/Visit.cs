namespace ApartmentTracker.Api.Models;

public class Visit
{
    public int Id { get; set; }
    public DateTime VisitDate { get; set; }
    public int Rating { get; set; }
    public string Notes { get; set; } = "";

    public int ApartmentId { get; set; }
    public Apartment Apartment { get; set; } = null!;
}
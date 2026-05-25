namespace ApartmentTracker.Api.Dtos;

public class CreateVisitRequest
{
    public int ApartmentId { get; set; }
    public DateTime VisitDate { get; set; }
    public int Rating { get; set; }
    public string Notes { get; set; } = "";
}
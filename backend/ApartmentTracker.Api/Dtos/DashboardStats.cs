using ApartmentTracker.Api.Models;

namespace ApartmentTracker.Api.Dtos;

public class DashboardStats
{
    public int TotalApartments { get; set; }
    public List<StatusCount> StatusBreakdown { get; set; } = new();
    public List<NeighborhoodStats> AveragePriceByNeighborhood { get; set; } = new();
    public List<WeeklyCount> ApartmentsPerWeek { get; set; } = new();
    public int SearchDurationDays { get; set; }
}

public class StatusCount
{
    public ApartmentStatus Status { get; set; }
    public int Count { get; set; }
}

public class NeighborhoodStats
{
    public string Neighborhood { get; set; } = "";
    public decimal AveragePrice { get; set; }
    public int Count { get; set; }
}

public class WeeklyCount
{
    public DateTime WeekStart { get; set; }
    public int Count { get; set; }
}
using ApartmentTracker.Api.Models;

namespace ApartmentTracker.Api.Dtos;

public class UpdateStatusRequest
{
    public ApartmentStatus Status { get; set; }
}
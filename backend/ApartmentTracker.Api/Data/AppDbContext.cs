using Microsoft.EntityFrameworkCore;
using ApartmentTracker.Api.Models;

namespace ApartmentTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Apartment> Apartments => Set<Apartment>();
    public DbSet<Visit> Visits => Set<Visit>();
}
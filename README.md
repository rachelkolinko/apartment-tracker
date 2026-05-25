# Apartment Hunt Tracker

A full-stack web application for managing the apartment hunting process — track apartments you're interested in, log visits, and visualize your search statistics.

Built as a Junior Full Stack portfolio project.

## Tech Stack

**Backend:** ASP.NET Core 10 Web API, Entity Framework Core, SQLite, JWT authentication, BCrypt
**Frontend:** React + TypeScript + Vite (coming soon)

## Features

- User registration and login with JWT authentication
- CRUD for apartments (neighborhood, price, status, contact info, link, notes)
- Visit logging per apartment with date, rating, and notes
- Dashboard statistics: status breakdown, average price by neighborhood, weekly activity, search duration

## Running locally

```bash
cd backend/ApartmentTracker.Api
dotnet restore
dotnet ef database update
dotnet run
```

The API will be available at `http://localhost:5121`.

## Project status

Work in progress.
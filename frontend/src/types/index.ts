// תואם ל-ApartmentStatus enum ב-backend (עם JsonStringEnumConverter)
export type ApartmentStatus =
  | 'Interested'
  | 'Visited'
  | 'PendingResponse'
  | 'Rejected'
  | 'GotIt';

// AuthResponse מה-backend
export interface AuthResponse {
  token: string;
  email: string;
}

// Visit (תואם ל-Models/Visit.cs)
export interface Visit {
  id: number;
  visitDate: string;   // DateTime מגיע כ-ISO string
  rating: number;      // 1-5
  notes: string;
  apartmentId: number;
}

// Apartment (תואם ל-Models/Apartment.cs)
export interface Apartment {
  id: number;
  neighborhood: string;
  address: string;
  rooms: number;
  sizeSqm: number;
  price: number;
  status: ApartmentStatus;
  contactName: string;
  contactPhone: string;
  listingUrl: string;
  notes: string;
  createdAt: string;
  userId: number;
  visits?: Visit[];    // רק ב-GET /api/apartments/{id}
}

// CreateApartmentRequest
export interface CreateApartmentRequest {
  neighborhood: string;
  address: string;
  rooms: number;
  sizeSqm: number;
  price: number;
  status: ApartmentStatus;
  contactName: string;
  contactPhone: string;
  listingUrl: string;
  notes: string;
}

// CreateVisitRequest
export interface CreateVisitRequest {
  apartmentId: number;
  visitDate: string;
  rating: number;
  notes: string;
}

// DashboardStats (תואם ל-Dtos/DashboardStats.cs)
export interface StatusCount {
  status: ApartmentStatus;
  count: number;
}

export interface NeighborhoodStats {
  neighborhood: string;
  averagePrice: number;
  count: number;
}

export interface WeeklyCount {
  weekStart: string;
  count: number;
}

export interface DashboardStats {
  totalApartments: number;
  statusBreakdown: StatusCount[];
  averagePriceByNeighborhood: NeighborhoodStats[];
  apartmentsPerWeek: WeeklyCount[];
  searchDurationDays: number;
}
import api from './client';
import type {
  Apartment,
  CreateApartmentRequest,
  ApartmentStatus,
} from '../types';

export async function getApartments() {
  const res = await api.get<Apartment[]>('/apartments');
  return res.data;
}

export async function getApartment(id: number) {
  const res = await api.get<Apartment>(`/apartments/${id}`);
  return res.data;
}

export async function createApartment(data: CreateApartmentRequest) {
  const res = await api.post<Apartment>('/apartments', data);
  return res.data;
}

export async function updateApartment(id: number, data: CreateApartmentRequest) {
  await api.put(`/apartments/${id}`, data);
}

export async function updateApartmentStatus(id: number, status: ApartmentStatus) {
  await api.patch(`/apartments/${id}/status`, { status });
}

export async function deleteApartment(id: number) {
  await api.delete(`/apartments/${id}`);
}
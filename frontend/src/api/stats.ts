import api from './client';
import type { DashboardStats } from '../types';

export async function getDashboardStats() {
  const res = await api.get<DashboardStats>('/stats/dashboard');
  return res.data;
}
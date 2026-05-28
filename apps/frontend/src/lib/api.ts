import type { Salon } from '@/types/salon';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type SalonFilters = {
  search?: string;
  district?: string;
  service?: string;
};

export async function fetchSalons(filters: SalonFilters = {}): Promise<Salon[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.district) params.set('district', filters.district);
  if (filters.service) params.set('service', filters.service);

  const query = params.toString();
  const res = await fetch(`${BASE_URL}/salons${query ? `?${query}` : ''}`);

  if (!res.ok) throw new Error('Failed to fetch salons');
  return res.json();
}

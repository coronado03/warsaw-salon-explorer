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

export async function fetchSalon(id: string): Promise<Salon> {
  const res = await fetch(`${BASE_URL}/salons/${id}`);
  if (!res.ok) throw new Error('Salon not found');
  return res.json();
}

export async function patchSalon(id: string, data: Partial<Salon>): Promise<Salon> {
  const res = await fetch(`${BASE_URL}/salons/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body.message) ? body.message.join(', ') : (body.message ?? 'Failed to update salon');
    throw new Error(message);
  }
  return res.json();
}

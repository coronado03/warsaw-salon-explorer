'use client';

import { HiSearch } from 'react-icons/hi';
import type { SalonFilters } from '@/lib/api';

type FilterBarProps = {
  filters: SalonFilters;
  districts: string[];
  services: string[];
  onChange: (filters: SalonFilters) => void;
};

export default function FilterBar({ filters, districts, services, onChange }: FilterBarProps) {
  const set = (patch: Partial<SalonFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Search salons…"
          value={filters.search ?? ''}
          onChange={(e) => set({ search: e.target.value || undefined })}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition"
        />
      </div>

      <select
        value={filters.district ?? ''}
        onChange={(e) => set({ district: e.target.value || undefined })}
        className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition cursor-pointer"
      >
        <option value="">All districts</option>
        {districts.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={filters.service ?? ''}
        onChange={(e) => set({ service: e.target.value || undefined })}
        className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition cursor-pointer"
      >
        <option value="">All services</option>
        {services.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}

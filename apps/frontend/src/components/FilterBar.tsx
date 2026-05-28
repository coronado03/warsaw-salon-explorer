'use client';

import { HiSearch } from 'react-icons/hi';
import type { SalonFilters } from '@/lib/api';
import SelectDropdown from './SelectDropdown';

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

      <SelectDropdown
        value={filters.district ?? '__all__'}
        placeholder="All districts"
        options={districts}
        onChange={(v) => set({ district: v === '__all__' ? undefined : v })}
      />

      <SelectDropdown
        value={filters.service ?? '__all__'}
        placeholder="All services"
        options={services}
        onChange={(v) => set({ service: v === '__all__' ? undefined : v })}
      />
    </div>
  );
}

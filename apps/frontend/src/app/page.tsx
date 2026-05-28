'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchSalons, type SalonFilters } from '@/lib/api';
import type { Salon } from '@/types/salon';
import SalonCard from '@/components/SalonCard';
import FilterBar from '@/components/FilterBar';

export default function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalonFilters>({});

  const load = useCallback(async (f: SalonFilters) => {
    setLoading(true);
    setError(null);
    try {
      setSalons(await fetchSalons(f));
    } catch {
      setError('Could not load salons. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filters); }, [filters, load]);

  const districts = useMemo(
    () => Array.from(new Set(salons.map((s) => s.district))).sort(),
    [salons],
  );

  const services = useMemo(
    () => Array.from(new Set(salons.flatMap((s) => s.services ?? []))).sort(),
    [salons],
  );

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Warsaw <span className="text-fuchsia-600">Salons</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">Find your perfect spot</p>
          </div>
          <span className="text-xs text-stone-400 hidden sm:block">
            {salons.length} salon{salons.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <FilterBar
          filters={filters}
          districts={districts}
          services={services}
          onChange={setFilters}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-rose-500 py-16">{error}</p>
        )}

        {!loading && !error && salons.length === 0 && (
          <p className="text-center text-sm text-stone-400 py-16">No salons found.</p>
        )}

        {!loading && !error && salons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

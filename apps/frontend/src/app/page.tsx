'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchSalons, type SalonFilters, type SalonsPage } from '@/lib/api';
import SalonCard from '@/components/SalonCard';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';

const LIMIT = 12;

export default function HomePage() {
  const [result, setResult] = useState<SalonsPage>({ data: [], total: 0, page: 1, totalPages: 1 });
  const [allDistricts, setAllDistricts] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalonFilters>({});
  const [page, setPage] = useState(1);

  const load = useCallback(async (f: SalonFilters, p: number) => {
    setLoading(true);
    setError(null);
    try {
      setResult(await fetchSalons(f, p, LIMIT));
    } catch {
      setError('Could not load salons. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all salons once (high limit) to populate filter dropdowns
  useEffect(() => {
    fetchSalons({}, 1, 1000).then((r) => {
      setAllDistricts(Array.from(new Set(r.data.map((s) => s.district))).sort());
      setAllServices(Array.from(new Set(r.data.flatMap((s) => s.services ?? []))).sort());
    }).catch(() => {});
  }, []);

  useEffect(() => { load(filters, page); }, [filters, page, load]);

  const handleFilterChange = (f: SalonFilters) => {
    setFilters(f);
    setPage(1);
  };

  const salons = result.data;

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
            {result.total} salon{result.total !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <FilterBar
          filters={filters}
          districts={allDistricts}
          services={allServices}
          onChange={handleFilterChange}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 flex flex-col gap-8">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-stone-100 animate-pulse" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={result.totalPages}
          onChange={setPage}
        />
      </div>
    </main>
  );
}

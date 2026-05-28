'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchSalons, type SalonFilters, type SalonsPage } from '@/lib/api';
import SalonCard from '@/components/SalonCard';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';

const LIMIT = 12;
const EMPTY: SalonsPage = { data: [], total: 0, page: 1, totalPages: 1 };

export default function HomePage() {
  const [result, setResult] = useState<SalonsPage>(EMPTY);
  const [allDistricts, setAllDistricts] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<string[]>([]);
  const [fetching, setFetching] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalonFilters>({});
  const [page, setPage] = useState(1);

  const load = useCallback(async (f: SalonFilters, p: number) => {
    setFetching(true);
    setError(null);
    try {
      const res = await fetchSalons(f, p, LIMIT);
      setResult(res);
    } catch {
      setError('Could not load salons. Is the backend running?');
    } finally {
      setFetching(false);
      setInitialLoad(false);
    }
  }, []);

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
  const showSkeleton = initialLoad && fetching;

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
        {error && (
          <p className="text-center text-sm text-rose-500 py-16">{error}</p>
        )}

        {showSkeleton && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        )}

        {!showSkeleton && !error && salons.length === 0 && !fetching && (
          <p className="text-center text-sm text-stone-400 py-16">No salons found.</p>
        )}

        {!showSkeleton && !error && salons.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch transition-opacity duration-150 ${fetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}

        {!showSkeleton && (
          <Pagination
            page={page}
            totalPages={result.totalPages}
            onChange={setPage}
          />
        )}
      </div>
    </main>
  );
}

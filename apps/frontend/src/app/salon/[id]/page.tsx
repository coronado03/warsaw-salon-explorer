import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import { fetchSalon } from '@/lib/api';
import SalonDetailClient from '@/components/SalonDetailClient';

type PageProps = {
  params: { id: string };
};

export default async function SalonDetailPage({ params }: PageProps) {
  const salon = await fetchSalon(params.id);

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-fuchsia-600 transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to salons
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400" />
          <div className="p-6 sm:p-8">
            <SalonDetailClient initial={salon} />
          </div>
        </div>
      </div>
    </main>
  );
}

import { MdLocationOn, MdPhone, MdLanguage } from 'react-icons/md';
import type { Salon } from '@/types/salon';
import StarRating from './StarRating';
import PriceRange from './PriceRange';
import ServiceTag from './ServiceTag';

type SalonDetailViewProps = {
  salon: Salon;
};

export default function SalonDetailView({ salon }: SalonDetailViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-tight">
          {salon.name}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {salon.priceRange && <PriceRange priceRange={salon.priceRange} />}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200">
            {salon.district}
          </span>
        </div>
      </div>

      {salon.rating != null && (
        <StarRating rating={salon.rating} reviewCount={salon.reviewCount} />
      )}

      <div className="flex flex-col gap-2 text-sm text-stone-600">
        <div className="flex items-start gap-2">
          <MdLocationOn className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
          <span>{salon.address}</span>
        </div>

        {salon.phone && (
          <div className="flex items-center gap-2">
            <MdPhone className="w-4 h-4 shrink-0 text-emerald-500" />
            <a
              href={`tel:${salon.phone}`}
              className="hover:text-fuchsia-600 transition-colors"
            >
              {salon.phone}
            </a>
          </div>
        )}

        {salon.website && (
          <div className="flex items-center gap-2">
            <MdLanguage className="w-4 h-4 shrink-0 text-indigo-400" />
            <a
              href={salon.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fuchsia-600 transition-colors truncate"
            >
              {salon.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {salon.services && salon.services.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Services
          </p>
          <div className="flex flex-wrap gap-2">
            {salon.services.map((s) => (
              <ServiceTag key={s} label={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

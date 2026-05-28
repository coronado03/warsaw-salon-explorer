import { MdLocationOn } from 'react-icons/md';
import type { Salon } from '@/types/salon';
import StarRating from './StarRating';
import PriceRange from './PriceRange';
import ServiceTag from './ServiceTag';

type SalonCardProps = {
  salon: Salon;
};

export default function SalonCard({ salon }: SalonCardProps) {
  const topServices = salon.services?.slice(0, 3) ?? [];

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-1 w-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400" />

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-stone-900 leading-snug group-hover:text-fuchsia-700 transition-colors">
            {salon.name}
          </h2>
          {salon.priceRange && <PriceRange priceRange={salon.priceRange} />}
        </div>

        <div className="flex items-center gap-1 text-stone-500">
          <MdLocationOn className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span className="text-xs truncate">{salon.district}</span>
        </div>

        {salon.rating != null && (
          <StarRating rating={salon.rating} reviewCount={salon.reviewCount} />
        )}

        {topServices.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {topServices.map((s) => (
              <ServiceTag key={s} label={s} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

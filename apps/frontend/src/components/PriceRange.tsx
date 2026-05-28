type PriceRangeProps = {
  priceRange: string;
};

export default function PriceRange({ priceRange }: PriceRangeProps) {
  const max = 4;
  const active = priceRange.length;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={
            i < active
              ? 'text-emerald-600 font-semibold text-sm'
              : 'text-stone-300 font-semibold text-sm'
          }
        >
          €
        </span>
      ))}
    </div>
  );
}

import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';

type StarRatingProps = {
  rating: number;
  reviewCount?: number | null;
};

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return half ? (
            <AiTwotoneStar key={star} className="text-amber-400 w-4 h-4" />
          ) : filled ? (
            <AiFillStar key={star} className="text-amber-400 w-4 h-4" />
          ) : (
            <AiOutlineStar key={star} className="text-amber-300 w-4 h-4" />
          );
        })}
      </div>
      <span className="text-xs text-stone-500 font-medium">
        {rating.toFixed(1)}
        {reviewCount != null && (
          <span className="text-stone-400 ml-1">({reviewCount})</span>
        )}
      </span>
    </div>
  );
}

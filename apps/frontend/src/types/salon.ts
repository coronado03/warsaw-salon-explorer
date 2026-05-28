export type Salon = {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string | null;
  website: string | null;
  services: string[] | null;
  priceRange: string | null;
  rating: number | null;
  reviewCount: number | null;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
};

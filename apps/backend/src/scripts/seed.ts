import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Salon } from '../salons/entities/salon.entity';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

const QUERIES = [
  'salon fryzjerski Warszawa',
  'salon kosmetyczny Warszawa',
  'barber Warszawa',
  'hair salon Warsaw',
  'manicure pedicure Warszawa',
];

const PRICE_MAP: Record<number, string> = { 1: '€', 2: '€€', 3: '€€€', 4: '€€€€' };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type PlaceResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
};

type AddressComponent = {
  long_name: string;
  types: string[];
};

type PlaceDetails = {
  formatted_phone_number?: string;
  website?: string;
  price_level?: number;
  address_components?: AddressComponent[];
};

async function fetchPage(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function collectPlaceIds(): Promise<Map<string, PlaceResult>> {
  const results = new Map<string, PlaceResult>();

  for (let qi = 0; qi < QUERIES.length; qi++) {
    console.log(`Fetching query ${qi + 1}/${QUERIES.length}: "${QUERIES[qi]}"...`);

    let pageToken: string | undefined;
    let page = 0;

    do {
      const params = new URLSearchParams({
        query: QUERIES[qi],
        key: GOOGLE_API_KEY!,
        ...(pageToken ? { pagetoken: pageToken } : {}),
      });

      const data = await fetchPage(`${TEXT_SEARCH_URL}?${params}`);

      for (const place of data.results as PlaceResult[]) {
        if (!results.has(place.place_id)) {
          results.set(place.place_id, place);
        }
      }

      pageToken = data.next_page_token;
      page++;

      if (pageToken) await sleep(2000);
    } while (pageToken && page < 3);
  }

  return results;
}

function extractDistrict(
  components: AddressComponent[] | undefined,
  formattedAddress: string,
): string {
  if (components) {
    const match = components.find((c) =>
      c.types.includes('sublocality_level_1') || c.types.includes('neighborhood'),
    );
    if (match) return match.long_name;
  }

  const parts = formattedAddress.split(',').map((p) => p.trim());
  const warsawIdx = parts.findIndex((p) => p.toLowerCase().includes('warszawa') || p.toLowerCase().includes('warsaw'));
  if (warsawIdx > 0) return parts[warsawIdx - 1];

  return 'Warszawa';
}

function inferServices(name: string): string[] {
  const n = name.toLowerCase();
  const services: string[] = [];

  if (n.includes('fryzjer') || n.includes('hair') || n.includes('barber')) services.push('Haircut');
  if (n.includes('barber')) services.push('Shaving');
  if (n.includes('kolor') || n.includes('color') || n.includes('colour')) services.push('Colouring');
  if (n.includes('kosmetycz') || n.includes('beauty') || n.includes('kosmetolog')) services.push('Facial');
  if (n.includes('manicu') || n.includes('maniku')) services.push('Manicure');
  if (n.includes('pedicu') || n.includes('pediku')) services.push('Pedicure');
  if (n.includes('spa')) services.push('Spa');
  if (n.includes('brow') || n.includes('lash')) services.push('Brows & Lashes');
  if (n.includes('massage') || n.includes('masaż')) services.push('Massage');

  return services.length > 0 ? services : ['Beauty Services'];
}

async function enrichPlace(placeId: string): Promise<PlaceDetails> {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'formatted_phone_number,website,price_level,address_components',
    key: GOOGLE_API_KEY!,
  });

  const data = await fetchPage(`${DETAILS_URL}?${params}`);
  return (data.result as PlaceDetails) ?? {};
}

async function main() {
  if (!GOOGLE_API_KEY) {
    console.error('Missing GOOGLE_PLACES_API_KEY in .env');
    process.exit(1);
  }

  const db = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? 'salon',
    password: process.env.DB_PASSWORD ?? 'salon',
    database: process.env.DB_NAME ?? 'salons',
    entities: [Salon],
    synchronize: true,
  });

  await db.initialize();
  const repo = db.getRepository(Salon);

  console.log('Collecting place IDs from Text Search...');
  const places = await collectPlaceIds();
  const all = Array.from(places.values());
  console.log(`Found ${all.length} unique places. Enriching...`);

  let inserted = 0;

  for (let i = 0; i < all.length; i++) {
    const place = all[i];
    console.log(`Enriching salon ${i + 1}/${all.length}: ${place.name}`);

    const existing = await repo.findOneBy({ googlePlaceId: place.place_id });
    if (existing) {
      console.log(`  → skipped (already exists)`);
      continue;
    }

    const details = await enrichPlace(place.place_id);
    await sleep(200);

    const district = extractDistrict(
      details.address_components,
      place.formatted_address,
    );

    const priceLevel = details.price_level ?? place.price_level ?? null;

    const salon = repo.create({
      googlePlaceId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      district,
      phone: details.formatted_phone_number ?? null,
      website: details.website ?? null,
      services: inferServices(place.name),
      priceRange: priceLevel != null ? PRICE_MAP[priceLevel] ?? null : null,
      rating: place.rating ?? null,
      reviewCount: place.user_ratings_total ?? null,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    });

    await repo.save(salon);
    inserted++;
  }

  await db.destroy();
  console.log(`Done: ${inserted} salons inserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

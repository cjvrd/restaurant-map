import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./types";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env from project root
config({ path: resolve(__dirname, "../.env") });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY in environment or .env file");
  process.exit(1);
}

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: "postgres",
      host: "localhost",
      user: "postgres",
      password: "postgres",
      port: 5432,
      max: 5,
    }),
  }),
});

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.types",
  "places.editorialSummary",
  "nextPageToken",
].join(",");

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  nationalPhoneNumber?: string;
  websiteUri?: string;
  editorialSummary?: { text: string };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
}

interface SearchResponse {
  places?: GooglePlace[];
  nextPageToken?: string;
}

async function fetchPlaces(): Promise<GooglePlace[]> {
  const allPlaces: GooglePlace[] = [];
  let pageToken: string | undefined;
  const maxPages = 3;

  for (let page = 0; page < maxPages; page++) {
    const body: Record<string, unknown> = {
      textQuery: "restaurants in Melbourne, Australia",
      locationBias: {
        circle: {
          center: { latitude: -37.8136, longitude: 144.9631 },
          radius: 30000.0,
        },
      },
      pageSize: 20,
    };

    if (pageToken) {
      body.pageToken = pageToken;
    }

    console.log(`Fetching page ${page + 1}...`);

    const response = await fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": String(API_KEY),
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      break;
    }

    const data: SearchResponse = await response.json();
    if (data.places) {
      allPlaces.push(...data.places);
      console.log(`  Got ${data.places.length} places (total: ${allPlaces.length})`);
    }

    if (!data.nextPageToken) {
      break;
    }
    pageToken = data.nextPageToken;
  }

  return allPlaces;
}

function cleanUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname.replace(/\/+$/, "");
  } catch {
    return url;
  }
}

function mapPlaceToRow(place: GooglePlace) {
  return {
    name: place.displayName?.text ?? "Unknown",
    address: place.formattedAddress ?? null,
    coordinates: place.location
      ? JSON.stringify({ lat: place.location.latitude, lng: place.location.longitude })
      : null,
    phone: place.nationalPhoneNumber ?? null,
    website: place.websiteUri ? cleanUrl(place.websiteUri) : null,
    description: place.editorialSummary?.text ?? null,
    google_place_id: place.id,
    google_rating: place.rating ?? null,
    google_rating_count: place.userRatingCount ?? null,
    price_level: place.priceLevel ?? null,
    types: place.types ? JSON.stringify(place.types) : null,
    updated_time: new Date(),
  };
}

async function main() {
  console.log("Fetching Melbourne restaurants from Google Places API...\n");

  const places = await fetchPlaces();
  if (places.length === 0) {
    console.log("No places found.");
    await db.destroy();
    return;
  }

  console.log(`\nInserting ${places.length} restaurants into database...`);

  let inserted = 0;
  for (const place of places) {
    const row = mapPlaceToRow(place);
    const result = await db
      .insertInto("Restaurant")
      .values(row)
      .onConflict((oc) => oc.column("google_place_id").doNothing())
      .executeTakeFirst();

    if (result.numInsertedOrUpdatedRows && result.numInsertedOrUpdatedRows > BigInt(0)) {
      inserted++;
    }
  }

  console.log(`Done! Inserted ${inserted} new restaurants (${places.length - inserted} duplicates skipped).`);
  await db.destroy();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

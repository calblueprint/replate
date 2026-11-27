import { z } from 'zod';

interface AddressLikeTask {
  location_name: string | null;
  address?: {
    street?: string | null;
    city?: string | null;
  } | null;
}

const CITY_FALLBACKS: [string[], string][] = [
  [['Oakland'], 'Oakland, CA'],
  [['Berkeley'], 'Berkeley, CA'],
  [['San Francisco', 'SF'], 'San Francisco, CA'],
  [['San Jose'], 'San Jose, CA'],
];

const AddressObjectSchema = z.object({
  number: z.string().trim().nullish(),
  street: z.string().trim().nullish(),
  city: z.string().trim().nullish(),
  state: z.string().trim().nullish(),
  zip: z.string().trim().nullish(),
});

const LegacyLocationSchema = z.object({
  street_address: z.string().trim().nullish(),
  city: z.string().trim().nullish(),
  state: z.string().trim().nullish(),
  zip_code: z.string().trim().nullish(),
});

const TaskPickupPayloadSchema = z.object({
  pickup_date: z.string().nullish(),
  scheduled_date: z.string().nullish(),
  start_time: z.string().nullish(),
  activity_start_time: z.string().nullish(),
  end_time: z.string().nullish(),
  activity_end_time: z.string().nullish(),
  address: z.union([z.string().trim(), AddressObjectSchema]).nullish(),
  location: LegacyLocationSchema.nullish(),
});

export interface TaskPickupInfo {
  pickup_date: string | null;
  start_time: string | null;
  end_time: string | null;
  address: string | null;
}

/** Format a short street/city label for a task card with a location-name fallback */
export function formatTaskAddress(task: AddressLikeTask): string {
  if (task.address) {
    const parts = [task.address.street, task.address.city].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
  }

  if (task.location_name) {
    for (const [needles, label] of CITY_FALLBACKS) {
      if (needles.some(needle => task.location_name!.includes(needle))) {
        return label;
      }
    }
    return 'Bay Area, CA';
  }

  return 'Address details in app';
}

/** Format a structured task address into a display or map-query string */
export function formatFullTaskAddress(
  address: unknown,
  options: { includeZip?: boolean; separator?: string } = {},
): string | null {
  const { includeZip = false, separator = ', ' } = options;
  if (typeof address === 'string') return address.trim() || null;

  const parsed = AddressObjectSchema.safeParse(address);
  if (!parsed.success) return null;

  const { number, street, city, state, zip } = parsed.data;
  const streetLine = [number, street].filter(Boolean).join(' ');
  const cityState = [city, state].filter(Boolean).join(', ');
  const parts = [streetLine, cityState, includeZip ? zip : null].filter(
    Boolean,
  );
  return parts.length > 0 ? parts.join(separator) : null;
}

/** Parse task pickup schedule and formatted address from raw API payload */
export function parseTaskPickupInfo(raw: unknown): TaskPickupInfo | null {
  const parsed = TaskPickupPayloadSchema.safeParse(raw);
  if (!parsed.success) return null;

  const data = parsed.data;
  const legacyAddress =
    !data.address && data.location
      ? [
          data.location.street_address,
          data.location.city,
          data.location.state,
          data.location.zip_code,
        ]
          .filter(Boolean)
          .join(', ') || null
      : null;

  return {
    pickup_date: data.pickup_date ?? data.scheduled_date ?? null,
    start_time: data.start_time ?? data.activity_start_time ?? null,
    end_time: data.end_time ?? data.activity_end_time ?? null,
    address: formatFullTaskAddress(data.address) ?? legacyAddress,
  };
}

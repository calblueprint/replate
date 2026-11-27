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

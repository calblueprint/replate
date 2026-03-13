type AddressFields = {
  number?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
};

/**
 * Format an address from structured fields into a display string.
 * Falls back to location name-based city detection if no address fields.
 */
export function formatAddress(
  address?: AddressFields | null,
  locationName?: string | null,
): string {
  if (address) {
    const { street, city, state, zip } = address;
    const parts: string[] = [];

    if (street) parts.push(street);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (zip) parts.push(zip);

    if (parts.length > 0) {
      return parts.join(', ');
    }
  }

  // Fallback to location name parsing
  if (locationName) {
    if (locationName.includes('Oakland')) return 'Oakland, CA';
    if (locationName.includes('Berkeley')) return 'Berkeley, CA';
    if (locationName.includes('San Francisco') || locationName.includes('SF'))
      return 'San Francisco, CA';
    if (locationName.includes('San Jose')) return 'San Jose, CA';
    return 'Bay Area, CA';
  }

  return 'Address details in app';
}

/**
 * Format a full address string from structured fields.
 * Used in pickup-details for maps links.
 */
export function formatFullAddress(address?: AddressFields | null): string {
  if (!address) return '';
  return [
    address.number,
    address.street,
    address.city && address.state
      ? `${address.city}, ${address.state}`
      : address.city || address.state,
    address.zip,
  ]
    .filter(Boolean)
    .join(' ');
}

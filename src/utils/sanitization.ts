/**
 * Input Sanitization Utilities
 * Provides safe parsing and sanitization of user input and external data
 */

/**
 * Safely parse JSON string with error handling
 * @param jsonString - The JSON string to parse
 * @param fallback - Optional fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T = unknown>(
  jsonString: string | null | undefined,
  fallback: T | null = null,
): T | null {
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }

  try {
    const parsed = JSON.parse(jsonString);
    return parsed as T;
  } catch {
    // JSON parsing failed, return fallback
    return fallback;
  }
}

/**
 * Validates that a value is a plain object (not null, array, etc.)
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

/**
 * Sanitize string input by trimming and optionally limiting length
 */
export function sanitizeString(
  input: string | null | undefined,
  options: { maxLength?: number; allowEmpty?: boolean } = {},
): string {
  const { maxLength, allowEmpty = true } = options;

  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();

  // Limit length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  // Check if empty strings are allowed
  if (!allowEmpty && sanitized.length === 0) {
    throw new Error('Input cannot be empty');
  }

  return sanitized;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Trim and convert to lowercase for email
  return email.trim().toLowerCase();
}

/**
 * Sanitize phone number input (remove non-digit characters except +)
 */
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Keep only digits, spaces, hyphens, parentheses, and plus sign
  return phone.replace(/[^\d\s\-()+ ]/g, '').trim();
}

/**
 * Validate and sanitize numeric input
 */
export function sanitizeNumber(
  input: string | number | null | undefined,
  options: { min?: number; max?: number; isInteger?: boolean } = {},
): number | null {
  const { min, max, isInteger = false } = options;

  if (input === null || input === undefined || input === '') {
    return null;
  }

  const num = typeof input === 'string' ? parseFloat(input) : input;

  if (isNaN(num)) {
    return null;
  }

  // Check if integer is required
  if (isInteger && !Number.isInteger(num)) {
    return null;
  }

  // Check min/max bounds
  if (min !== undefined && num < min) {
    return null;
  }

  if (max !== undefined && num > max) {
    return null;
  }

  return num;
}

/**
 * Sanitize and validate URL input
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();

  try {
    const parsedUrl = new URL(trimmed);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }
    return parsedUrl.toString();
  } catch {
    return null;
  }
}

/**
 * Remove potentially dangerous HTML/script content from strings
 * Simple implementation - for display purposes only, not for security-critical HTML rendering
 */
export function stripHtmlTags(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize object keys and values recursively
 * Useful for sanitizing API responses before storing
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: unknown,
): T | null {
  if (!isPlainObject(obj)) {
    return null;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip prototype pollution attempts
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else if (isPlainObject(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        isPlainObject(item) ? sanitizeObject(item) : item,
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

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
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
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

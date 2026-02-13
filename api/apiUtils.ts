// API Utility for robust network handling
// Provides timeout, retry logic, and response validation

import { sanitizeObject } from '../src/utils/sanitization';

export interface ApiOptions extends RequestInit {
  timeout?: number; // in milliseconds
  retries?: number;
  retryDelay?: number; // in milliseconds
  validateResponse?: (data: unknown) => boolean;
  sanitize?: boolean; // Whether to sanitize response data (default: true)
}

export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(message: string, status: number = 0, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Creates a fetch request with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number },
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'Request timeout. Please check your connection and try again.',
        0,
        ['timeout'],
      );
    }
    throw error;
  }
}

/**
 * Delays execution for a specified amount of time
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) {
    // Retry on network errors (status 0) and server errors (5xx)
    return error.status === 0 || (error.status >= 500 && error.status < 600);
  }
  if (error instanceof TypeError) {
    // Network errors from fetch
    return true;
  }
  return false;
}

/**
 * Validates that response has expected structure
 */
export function validateResponse(
  data: unknown,
  requiredFields: string[],
): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  for (const field of requiredFields) {
    if (!(field in data)) {
      return false;
    }
  }

  return true;
}

/**
 * Validates an array response
 */
export function validateArrayResponse(
  data: unknown,
  itemValidator?: (item: unknown) => boolean,
): boolean {
  if (!Array.isArray(data)) {
    return false;
  }

  if (itemValidator) {
    return data.every(itemValidator);
  }

  return true;
}

/**
 * Main API function with timeout, retry, and validation support
 */
export async function apiRequest<T = unknown>(
  url: string,
  options: ApiOptions = {},
): Promise<T> {
  const {
    timeout = 30000,
    retries = 2,
    retryDelay = 1000,
    validateResponse: customValidator,
    sanitize = true,
    ...fetchOptions
  } = options;

  let lastError: Error | ApiError | null = null;
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, {
        ...fetchOptions,
        timeout,
      });

      // Handle non-OK responses
      if (!response.ok) {
        const responseClone = response.clone();
        let errorData: { errors?: string[]; error?: string; message?: string };

        try {
          errorData = await response.json();
        } catch {
          // JSON parsing failed, try text
          try {
            const text = await responseClone.text();
            throw new ApiError(
              text || `Server error (${response.status})`,
              response.status,
            );
          } catch {
            throw new ApiError(
              `Server error (${response.status})`,
              response.status,
            );
          }
        }

        const errorMessage =
          errorData.errors?.join(', ') ||
          errorData.error ||
          errorData.message ||
          `Request failed with status ${response.status}`;

        throw new ApiError(
          errorMessage,
          response.status,
          errorData.errors || [],
        );
      }

      // Parse successful response
      let data = await response.json();

      // Sanitize response to prevent prototype pollution
      if (sanitize && typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
          data = data.map(item =>
            typeof item === 'object' && item !== null && !Array.isArray(item)
              ? sanitizeObject(item)
              : item,
          );
        } else {
          data = sanitizeObject(data);
        }
      }

      // Validate response structure if validator provided
      if (customValidator && !customValidator(data)) {
        throw new ApiError(
          'Invalid response structure from server',
          response.status,
          ['validation_failed'],
        );
      }

      return data as T;
    } catch (error) {
      lastError =
        error instanceof ApiError || error instanceof Error
          ? error
          : new ApiError('Unknown error occurred');

      // Check if error is retryable and we have retries left
      if (isRetryableError(lastError) && attempt < retries) {
        attempt++;
        await delay(retryDelay * attempt); // Exponential backoff
        continue;
      }

      // Not retryable or out of retries
      break;
    }
  }

  // Handle network errors with user-friendly message
  if (lastError instanceof TypeError && lastError.message.includes('fetch')) {
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0,
    );
  }

  // Re-throw the last error
  throw lastError;
}

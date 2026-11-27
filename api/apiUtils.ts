// API Utility for robust network handling
// Provides timeout, retry logic, and Zod schema validation

import type { z } from 'zod';

export interface ApiOptions extends RequestInit {
  timeout?: number; // in milliseconds
  retries?: number;
  retryDelay?: number; // in milliseconds
  schema?: z.ZodType;
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
 * Main API function with timeout, retry, and Zod schema validation
 */
export async function apiRequest<T = unknown>(
  url: string,
  options: ApiOptions = {},
): Promise<T> {
  const {
    timeout = 30000,
    retries = 2,
    retryDelay = 1000,
    schema,
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

      // Parse successful response. Endpoints that return 204 No Content (or
      // any successful response with an empty body) have nothing to parse —
      // calling response.json() on them throws SyntaxError, which then gets
      // swallowed by callers' try/catch and silently looks like a network
      // failure even though the request succeeded. Treat empty bodies as
      // undefined and skip JSON parsing.
      const contentLength = response.headers.get('content-length');
      const hasEmptyBody = response.status === 204 || contentLength === '0';
      const data: unknown = hasEmptyBody ? undefined : await response.json();

      // Validate response structure with Zod if schema provided. Skip validation
      // for empty-body responses — schemas assume a body exists, and a 204
      // isn't a structural failure.
      if (!hasEmptyBody && schema) {
        const result = schema.safeParse(data);
        if (!result.success) {
          throw new ApiError(
            'Invalid response structure from server',
            response.status,
            ['validation_failed'],
          );
        }
        return result.data as T;
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

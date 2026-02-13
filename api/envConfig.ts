/**
 * Environment Configuration and Validation
 * Validates and provides type-safe access to environment variables
 */

interface EnvConfig {
  API_BASE_URL: string;
}

/**
 * Validates that required environment variables are set and properly formatted
 * @throws Error if required environment variables are missing or invalid
 */
function validateEnvConfig(): EnvConfig {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Validate API_BASE_URL is set
  if (!apiBaseUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is required but not set. ' +
        'Please create a .env file with EXPO_PUBLIC_API_BASE_URL defined.',
    );
  }

  // Validate URL format
  try {
    const url = new URL(apiBaseUrl);
    // Ensure it's http or https
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('URL must use http or https protocol');
    }
  } catch (error) {
    throw new Error(
      `EXPO_PUBLIC_API_BASE_URL must be a valid URL. Got: "${apiBaseUrl}". ` +
        `Error: ${error instanceof Error ? error.message : 'Invalid URL'}`,
    );
  }

  return {
    API_BASE_URL: apiBaseUrl,
  };
}

/**
 * Get validated environment configuration
 * Uses a fallback URL if validation fails (development mode only)
 */
export function getEnvConfig(): EnvConfig {
  try {
    return validateEnvConfig();
  } catch (error) {
    // In development, provide a fallback with warning
    if (__DEV__) {
      const fallbackUrl = 'http://localhost:3000';
      console.warn(
        `Environment validation failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
          `Using fallback URL: ${fallbackUrl}`,
      );
      return {
        API_BASE_URL: fallbackUrl,
      };
    }
    // In production, throw the error
    throw error;
  }
}

/**
 * Singleton instance of validated environment config
 */
export const ENV_CONFIG = getEnvConfig();

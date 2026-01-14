/**
 * Error Handling Utilities for Database Queries
 *
 * Provides graceful fallbacks when database is unavailable (e.g., during Vercel build).
 * Prevents complete application crashes on DB connection errors.
 */

/**
 * Wrap a database query with error handling and fallback
 *
 * @param queryFn - The async query function to execute
 * @param fallbackValue - Value to return if query fails
 * @param errorMessage - Custom error message for logging
 * @returns Query result or fallback value
 *
 * @example
 * ```ts
 * const items = await safeQuery(
 *   () => prisma.galleryItem.findMany(),
 *   [],
 *   "Failed to fetch gallery items"
 * );
 * ```
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T,
  errorMessage: string
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    // Log error for debugging but don't crash the app
    console.error(`[DB Query Error] ${errorMessage}:`, error);
    return fallbackValue;
  }
}

/**
 * Check if an error is a database connection error
 */
export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("tenant or user not found") ||
      message.includes("connection") ||
      message.includes("econnrefused") ||
      message.includes("timeout")
    );
  }
  return false;
}

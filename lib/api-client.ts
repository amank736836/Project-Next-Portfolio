/**
 * API Client Wrapper with Automatic Error Logging
 * 
 * Usage:
 * import { apiClient } from '@/lib/api-client';
 * 
 * const response = await apiClient.post('/api/projects', { title: 'My Project' });
 * 
 * // Or use the lower-level fetch wrapper:
 * import { fetchWithLogging } from '@/lib/api-client';
 * const data = await fetchWithLogging('/api/endpoint', { method: 'POST', body: JSON.stringify(payload) });
 */

const API_LOG_ENDPOINT = '/api/admin/api-logs';

interface FetchOptions extends RequestInit {
  /** Skip logging for this request (e.g., for health checks) */
  skipLogging?: boolean;
  /** Custom metadata to include in logs */
  metadata?: Record<string, unknown>;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

/**
 * Sanitize sensitive data from objects
 */
function sanitize(obj: unknown, keysToRedact = ['password', 'token', 'secret', 'authorization', 'cookie', 'api_key', 'apikey']): unknown {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // Try to parse JSON strings
    try {
      return sanitize(JSON.parse(obj), keysToRedact);
    } catch {
      return obj;
    }
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item, keysToRedact));
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (keysToRedact.some(k => lowerKey.includes(k))) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = sanitize(value, keysToRedact);
      }
    }
    return result;
  }
  
  return obj;
}

/**
 * Get client IP from request headers
 */
function getClientIp(headers: Headers): string | null {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    null
  );
}

/**
 * Core fetch wrapper with automatic error logging
 */
export async function fetchWithLogging<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    skipLogging = false,
    metadata = {},
    headers = {},
    body,
    method = 'GET',
    ...fetchOptions
  } = options;

  const startTime = performance.now();
  const requestHeaders = new Headers(headers);
  
  // Add content-type if body exists and no content-type set
  if (body && !requestHeaders.has('content-type')) {
    if (typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
      requestHeaders.set('content-type', 'application/json');
    }
  }

  // Prepare request body for logging
  const requestBodyForLog = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined;
  
  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body,
      ...fetchOptions,
    });

    const durationMs = Math.round(performance.now() - startTime);
    const responseText = await response.text();
    
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
      responseData = responseText;
    }

    const status = response.status;
    const isError = !response.ok;

    // Log to API logs table (fire and forget)
    if (!skipLogging) {
      logToApi({
        endpoint: url,
        method,
        status_code: status,
        request_body: sanitize(requestBodyForLog),
        request_headers: sanitize(Object.fromEntries(requestHeaders.entries())),
        response_body: sanitize(responseData),
        error_message: isError ? `HTTP ${status}: ${response.statusText}` : undefined,
        duration_ms: durationMs,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        ip_address: null, // Will be filled by server
        metadata,
      }).catch(() => {}); // Fire and forget
    }

    if (isError) {
      const error = new Error(`API Error: ${status} ${response.statusText}`);
      error.name = 'ApiError';
      (error as Error & { status: number; data: unknown }).status = status;
      (error as Error & { status: number; data: unknown }).data = responseData;
      
      return { data: null, error, status };
    }

    return { data: responseData as T, error: null, status };
  } catch (err) {
    const durationMs = Math.round(performance.now() - startTime);
    const error = err as Error;
    
    // Log network errors
    if (!skipLogging) {
      logToApi({
        endpoint: url,
        method,
        status_code: 0,
        request_body: sanitize(requestBodyForLog),
        request_headers: sanitize(Object.fromEntries(requestHeaders.entries())),
        error_message: error.message,
        error_stack: error.stack,
        duration_ms: durationMs,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        metadata,
      }).catch(() => {});
    }

    return { data: null, error, status: 0 };
  }
}

/**
 * Send log to API logs table
 */
async function logToApi(logData: Record<string, unknown>): Promise<void> {
  try {
    await fetch(API_LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });
  } catch {
    // Silently fail - logging shouldn't break the app
  }
}

/**
 * Convenience methods
 */
export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) => 
    fetchWithLogging<T>(url, { ...options, method: 'GET' }),
  
  post: <T>(url: string, data: unknown, options?: FetchOptions) => 
    fetchWithLogging<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  
  put: <T>(url: string, data: unknown, options?: FetchOptions) => 
    fetchWithLogging<T>(url, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  
  patch: <T>(url: string, data: unknown, options?: FetchOptions) => 
    fetchWithLogging<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: <T>(url: string, options?: FetchOptions) => 
    fetchWithLogging<T>(url, { ...options, method: 'DELETE' }),
};

/**
 * HOC for wrapping API route handlers with automatic error logging
 * 
 * Usage in API routes:
 * import { withApiLogging } from '@/lib/api-client';
 * 
 * export const GET = withApiLogging(async (request) => {
 *   // Your handler logic
 *   return NextResponse.json({ data: 'ok' });
 * });
 */
export function withApiLogging(
  handler: (request: Request) => Promise<Response>,
  options: { skipLogging?: boolean; logRequestBody?: boolean } = {}
) {
  return async (request: Request): Promise<Response> => {
    const startTime = performance.now();
    const url = new URL(request.url);
    const endpoint = url.pathname + url.search;
    
    try {
      const response = await handler(request);
      const durationMs = Math.round(performance.now() - startTime);
      
      // Log success
      if (!options.skipLogging) {
        logToApi({
          endpoint,
          method: request.method,
          status_code: response.status,
          duration_ms: durationMs,
          request_body: options.logRequestBody ? await request.clone().text() : undefined,
        }).catch(() => {});
      }
      
      return response;
    } catch (error) {
      const durationMs = Math.round(performance.now() - startTime);
      const err = error as Error;
      
      // Log error
      logToApi({
        endpoint,
        method: request.method,
        status_code: 500,
        duration_ms: durationMs,
        error_message: err.message,
        error_stack: err.stack,
        request_body: options.logRequestBody ? await request.clone().text() : undefined,
      }).catch(() => {});
      
      // Re-throw to let Next.js handle it
      throw error;
    }
  };
}

/**
 * Client-side only: Get logs for admin dashboard
 */
export async function getApiLogs(params: {
  page?: number;
  limit?: number;
  endpoint?: string;
  status?: number;
  hasError?: boolean;
  from?: string;
  to?: string;
} = {}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });
  
  const response = await fetch(`/api/admin/api-logs?${searchParams.toString()}`);
  return response.json();
}

export default apiClient;
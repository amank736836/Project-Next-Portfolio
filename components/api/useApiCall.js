"use client";

import { useState, useCallback } from "react";

/**
 * Hook for making API calls with automatic logging to api_logs table
 * Captures: endpoint, method, status, duration, error details
 */
export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (endpoint, options = {}) => {
    const startTime = performance.now();
    const method = options.method || 'GET';
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const durationMs = Math.round(performance.now() - startTime);
      const statusCode = response.status;

      // Clone response to read body for logging
      let responseBody = null;
      let responseText = null;
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        responseText = await response.text();
        try {
          responseBody = JSON.parse(responseText);
        } catch {
          responseBody = responseText;
        }
      }

      // Log failed requests
      if (!response.ok) {
        await logApiCall({
          endpoint,
          method,
          status_code: statusCode,
          request_body: options.body ? JSON.parse(options.body) : null,
          response_body: responseBody,
          error_message: `HTTP ${statusCode}: ${response.statusText}`,
          duration_ms: durationMs,
        }).catch(console.error);

        const err = new Error(`API Error: ${statusCode}`);
        err.status = statusCode;
        err.response = responseBody;
        throw err;
      }

      // Log successful requests (optional - only log in development or for specific endpoints)
      if (process.env.NODE_ENV === 'development' || endpoint.includes('/admin/')) {
        await logApiCall({
          endpoint,
          method,
          status_code: statusCode,
          request_body: options.body ? JSON.parse(options.body) : null,
          response_body: responseBody,
          duration_ms: durationMs,
        }).catch(console.error);
      }

      return { 
        data: responseBody, 
        response,
        status: statusCode 
      };

    } catch (err) {
      const durationMs = Math.round(performance.now() - startTime);
      
      // Log network errors / exceptions
      if (!err.status) {
        await logApiCall({
          endpoint,
          method,
          status_code: 0,
          request_body: options.body ? JSON.parse(options.body) : null,
          error_message: err.message,
          error_stack: err.stack,
          duration_ms: durationMs,
        }).catch(console.error);
      }

      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { call, loading, error };
}

/**
 * Internal function to log API calls to the database
 */
async function logApiCall(data) {
  // Don't log in development to avoid noise
  if (process.env.NODE_ENV === 'development' && !data.endpoint.includes('/admin/')) {
    return;
  }

  try {
    // Sanitize sensitive data
    const sanitized = {
      ...data,
      request_body: sanitizeRequestBody(data.request_body),
      request_headers: sanitizeHeaders(data.request_headers),
      response_body: sanitizeResponseBody(data.response_body),
    };

    await fetch('/api/admin/api-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
  } catch (e) {
    // Silently fail - don't break the app if logging fails
    console.warn('Failed to log API call:', e);
  }
}

/**
 * Sanitize sensitive fields from request body
 */
function sanitizeRequestBody(body) {
  if (!body || typeof body !== 'object') return body;
  
  const sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'auth', 'credential',
    'api_key', 'apikey', 'access_token', 'refresh_token',
    'authorization', 'cookie', 'session', 'jwt'
  ];
  
  const sanitized = { ...body };
  
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeRequestBody(sanitized[key]);
    }
  }
  
  return sanitized;
}

/**
 * Sanitize headers
 */
function sanitizeHeaders(headers) {
  if (!headers) return headers;
  
  const sensitiveHeaders = [
    'authorization', 'cookie', 'set-cookie', 'x-api-key',
    'x-auth-token', 'authorization-bearer'
  ];
  
  const sanitized = { ...headers };
  
  for (const key of Object.keys(sanitized)) {
    if (sensitiveHeaders.some(h => key.toLowerCase() === h)) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

/**
 * Sanitize response body
 */
function sanitizeResponseBody(body) {
  if (!body || typeof body !== 'object') return body;
  
  // Don't log large responses
  const str = JSON.stringify(body);
  if (str.length > 10000) {
    return { _truncated: true, length: str.length };
  }
  
  return sanitizeRequestBody(body);
}

/**
 * Higher-order component for server-side API route logging
 * Wraps an API route handler to automatically log requests/responses
 */
export function withApiLogging(handler, options = {}) {
  return async (req, res) => {
    const startTime = performance.now();
    const endpoint = req.url;
    const method = req.method;
    
    // Parse body if JSON
    let requestBody = null;
    if (req.headers.get('content-type')?.includes('application/json')) {
      try {
        const text = await req.text();
        requestBody = text ? JSON.parse(text) : null;
        // Re-create request with parsed body for downstream handler
        req.json = async () => requestBody;
      } catch {
        // Ignore parse errors
      }
    }

    // Capture response
    const originalJson = res.json.bind(res);
    let responseBody = null;
    let statusCode = 200;

    res.json = (data) => {
      responseBody = data;
      return originalJson(data);
    };

    // Capture status
    const originalStatus = res.status.bind(res);
    res.status = (code) => {
      statusCode = code;
      return originalStatus(code);
    };

    try {
      await handler(req, res);
    } catch (err) {
      statusCode = err.statusCode || 500;
      throw err;
    } finally {
      const durationMs = Math.round(performance.now() - startTime);
      
      // Log if failed or if explicitly enabled
      const shouldLog = !res.ok || options.logAll || process.env.NODE_ENV === 'development';
      
      if (shouldLog) {
        logApiCall({
          endpoint,
          method,
          status_code: statusCode,
          request_body: requestBody,
          response_body: responseBody,
          error_message: statusCode >= 400 ? `HTTP ${statusCode}` : null,
          duration_ms: durationMs,
        }).catch(console.error);
      }
    }
  };
}

/**
 * Utility for client-side API calls with logging
 */
export async function loggedFetch(endpoint, options = {}) {
  const startTime = performance.now();
  const method = options.method || 'GET';
  
  try {
    const response = await fetch(endpoint, options);
    const durationMs = Math.round(performance.now() - startTime);
    
    let responseBody = null;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      responseBody = await response.json();
    }
    
    if (!response.ok) {
      await logApiCall({
        endpoint,
        method,
        status_code: response.status,
        request_body: options.body ? JSON.parse(options.body) : null,
        response_body: responseBody,
        error_message: `HTTP ${response.status}: ${response.statusText}`,
        duration_ms: durationMs,
      });
    }
    
    return { response, data: responseBody, durationMs };
  } catch (err) {
    const durationMs = Math.round(performance.now() - startTime);
    await logApiCall({
      endpoint,
      method,
      status_code: 0,
      request_body: options.body ? JSON.parse(options.body) : null,
      error_message: err.message,
      error_stack: err.stack,
      duration_ms: durationMs,
    });
    throw err;
  }
}

export { logApiCall, sanitizeRequestBody, sanitizeHeaders };
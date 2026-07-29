import { createAdminClient } from '@/lib/supabase/server';

let supabaseAdmin = null;

async function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = await createAdminClient();
  }
  return supabaseAdmin;
}

function sanitizeHeaders(headers) {
  const sensitive = ['authorization', 'cookie', 'x-api-key', 'x-forwarded-for'];
  const sanitized = {};
  headers.forEach((value, key) => {
    if (!sensitive.includes(key.toLowerCase())) {
      sanitized[key] = value;
    }
  });
  return sanitized;
}

function sanitizeBody(body) {
  if (!body || typeof body !== 'object') return body;
  const sensitive = ['password', 'token', 'secret', 'api_key', 'apikey', 'authorization'];
  const sanitized = { ...body };
  for (const key of Object.keys(sanitized)) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeBody(sanitized[key]);
    }
  }
  return sanitized;
}

export async function logApiRequest({
  endpoint,
  method,
  statusCode,
  requestHeaders,
  requestBody,
  responseBody,
  errorMessage,
  errorStack,
  durationMs,
  userId,
  userAgent,
  ipAddress,
}) {
  try {
    const supabase = await getSupabaseAdmin();
    await supabase.from('api_logs').insert({
      endpoint,
      method,
      status_code: statusCode,
      request_headers: sanitizeHeaders(requestHeaders),
      request_body: sanitizeBody(requestBody),
      response_body: sanitizeBody(responseBody),
      error_message: errorMessage,
      error_stack: errorStack,
      duration_ms: durationMs,
      user_id: userId,
      user_agent: userAgent,
      ip_address: ipAddress,
    });
  } catch (e) {
    console.error('Failed to log API request:', e);
  }
}

export function withApiLogging(handler, options = {}) {
  return async (request, context) => {
    const startTime = Date.now();
    const endpoint = request.nextUrl?.pathname || 'unknown';
    const method = request.method;
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    let userId = null;
    try {
      const { getServerSession } = await import('next-auth');
      const { authOptions } = await import('@/lib/auth');
      const session = await getServerSession(authOptions);
      userId = session?.user?.id || null;
    } catch {}

    let statusCode = 200;
    let errorMessage = null;
    let errorStack = null;
    let responseBody = null;
    let requestBody = null;

    try {
      // Clone request to read body
      const clonedRequest = request.clone();
      try {
        requestBody = await clonedRequest.json();
      } catch {}
      
      const response = await handler(request, context);
      
      statusCode = response.status;
      try {
        const clonedResponse = response.clone();
        responseBody = await clonedResponse.json();
      } catch {
        responseBody = await response.text().catch(() => null);
      }
      
      return response;
    } catch (error) {
      statusCode = error.status || 500;
      errorMessage = error.message;
      errorStack = error.stack;
      throw error;
    } finally {
      const durationMs = Date.now() - startTime;
      
      // Log async (don't await)
      logApiRequest({
        endpoint,
        method,
        statusCode,
        requestHeaders: Object.fromEntries(request.headers.entries()),
        requestBody,
        responseBody,
        errorMessage,
        errorStack,
        durationMs,
        userId,
        userAgent,
        ipAddress,
      });
    }
  };
}
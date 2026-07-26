import { NextResponse } from 'next/server';
import { getSession, isTokenExpired } from '@/lib/cookies';

const PROTECTED_PATHS = ['/admin', '/dashboard'];
const PUBLIC_API_PATHS = ['/api/auth'];
const PROTECTED_WRITE_API_PATHS = ['/api/admin', '/api/auth/logout', '/api/auth/refresh'];

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 60;

// ⚠️ In-memory rate limiter - DOES NOT WORK IN SERVERLESS (Vercel)
// Each function invocation gets a fresh Map. Use Upstash Redis or similar for production.
// Example: import { Ratelimit } from '@upstash/ratelimit'; import { Redis } from '@upstash/redis';
const rateLimitStore = new Map();

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function isMutatingMethod(method) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
}

function isProtectedWriteApi(pathname) {
  return PROTECTED_WRITE_API_PATHS.some((path) => pathname.startsWith(path));
}

function getExpectedOrigin(request) {
  const host = request.headers.get('host');
  if (!host) return null;
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const protocol = forwardedProto || request.nextUrl.protocol.replace(':', '');
  return `${protocol}://${host}`;
}

function hasValidSameOrigin(request) {
  const expectedOrigin = getExpectedOrigin(request);
  if (!expectedOrigin) return false;

  const origin = request.headers.get('origin');
  if (origin) {
    return origin === expectedOrigin;
  }

  const referer = request.headers.get('referer');
  if (!referer) {
    return false;
  }

  try {
    const refererOrigin = new URL(referer).origin;
    return refererOrigin === expectedOrigin;
  } catch {
    return false;
  }
}

function enforceRateLimit(request) {
  // Skip in production if Upstash is configured (placeholder)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // TODO: Implement Upstash rate limiting here
    // const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(60, '60 s') });
    // return await ratelimit.limit(key);
    return null;
  }

  const pathname = request.nextUrl.pathname;
  const ip = getClientIp(request);
  const key = `${ip}:${pathname}:${request.method}`;
  const now = Date.now();

  const current = rateLimitStore.get(key);
  if (!current || now > current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  current.count += 1;
  if (current.count > RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, retryAfterSeconds)),
        },
      }
    );
  }

  return null;
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  console.log(`[Middleware] Checking path: ${pathname}`);

  const shouldProtectWriteApi = isProtectedWriteApi(pathname) && isMutatingMethod(method);

  if (shouldProtectWriteApi) {
    const limited = enforceRateLimit(request);
    if (limited) {
      return limited;
    }

    if (!hasValidSameOrigin(request)) {
      return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
    }
  }

  // Check if it's an API admin route (needs protection)
  const isApiAdminRoute = pathname.startsWith('/api/admin');
  
  // Check if it's a public API route (no protection needed)
  const isPublicApiRoute = PUBLIC_API_PATHS.some(path =>
    pathname.startsWith(path)
  );

  // Check if it's a protected page route
  const isProtectedPage = PROTECTED_PATHS.some(path =>
    pathname.startsWith(path)
  );

  const needsAuth = isApiAdminRoute || isProtectedPage;

  if (needsAuth && !isPublicApiRoute) {
    const session = await getSession(request.cookies);
    const expired = session ? isTokenExpired(session) : 'N/A';
    console.log(`[Middleware] Session found: ${!!session}, Expired: ${expired}`);

    // Redirect to login if no session exists or token is expired
    if (!session || expired === true) {
      console.log(`[Middleware] Redirecting to login from ${pathname}`);
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      
      // If it's an API route, return 401 instead of redirecting
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      return NextResponse.redirect(loginUrl);
    }

    // Email Authorization Check
    const AUTHORIZED_EMAIL = process.env.AUTHORIZED_ADMIN_EMAIL || 'amankarguwal0@gmail.com';
    const userEmail = session.user?.email;

    if (userEmail !== AUTHORIZED_EMAIL) {
      console.log(`[Middleware] Unauthorized access attempt by ${userEmail}. Restricting to ${AUTHORIZED_EMAIL}`);
      
      // If it's an API route, return 403 Forbidden
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Forbidden: Unauthorized Email' }, { status: 403 });
      }
      
      // For page routes, redirect to home with an unauthorized error flag
      const unauthorizedUrl = new URL('/', request.url);
      unauthorizedUrl.searchParams.set('error', 'unauthorized_email');
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js)$).*)'],
};
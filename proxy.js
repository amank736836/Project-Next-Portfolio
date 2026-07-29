import { NextResponse } from 'next/server';
import { getSession, isTokenExpired } from '@/lib/cookies';

const PROTECTED_PATHS = ['/admin', '/dashboard'];
const PUBLIC_API_PATHS = ['/api/auth'];
const PROTECTED_WRITE_API_PATHS = ['/api/admin', '/api/auth/logout', '/api/auth/refresh'];

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 60;

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
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
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

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const { method } = request;

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

  const isApiAdminRoute = pathname.startsWith('/api/admin');
  const isPublicApiRoute = PUBLIC_API_PATHS.some(path => pathname.startsWith(path));
  const isProtectedPage = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  const needsAuth = isApiAdminRoute || isProtectedPage;

  if (needsAuth && !isPublicApiRoute) {
    const session = await getSession(request.cookies);
    const expired = session ? isTokenExpired(session) : 'N/A';

    if (!session || expired === true) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      return NextResponse.redirect(loginUrl);
    }

    const AUTHORIZED_EMAIL = process.env.AUTHORIZED_ADMIN_EMAIL || 'amankarguwal0@gmail.com';
    const userEmail = session.user?.email;

    if (userEmail !== AUTHORIZED_EMAIL) {
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Forbidden: Unauthorized Email' }, { status: 403 });
      }
      
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
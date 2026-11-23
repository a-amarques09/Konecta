import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import service from './service.mjs';



const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(identifier: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    record.count++;
    return true;
}

function nextAuthSecret(): string {
    return service.input().nextAuthSecret.expose();
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
        const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
        const identifier = `${ip}:${pathname}`;

        if (!rateLimit(identifier)) {
            return NextResponse.json(
                { error: 'Muitas solicitações. Tente novamente mais tarde.' },
                { status: 429 }
            );
        }
    }
    if (pathname.startsWith('/admin')) {
        const token = await getToken({ req: request, secret: nextAuthSecret() });

        if (!token || token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Protect seller routes
    if (pathname.startsWith('/seller') || pathname.startsWith('/products/create')) {
        const token = await getToken({ req: request, secret: nextAuthSecret() });

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    // Security headers
    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        const token = await getToken({ req: request, secret: nextAuthSecret() });

        if (!token || token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Protect seller routes
    if (pathname.startsWith('/seller') || pathname.startsWith('/products/create')) {
        const token = await getToken({ req: request, secret: nextAuthSecret() });

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

export const config = {
    runtime: 'nodejs',
    matcher: ['/api/:path*', '/admin/:path*', '/seller/:path*', '/products/create'],
};
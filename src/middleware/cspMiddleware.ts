// middleware/cspMiddleware.ts
import { NextResponse } from 'next/server';

// Generate a random nonce
function generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64');
}

export function cspMiddleware(res: NextResponse): NextResponse {
    const nonce = generateNonce();
    const isDev = process.env.NODE_ENV !== 'production';

    const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' ${isDev ? "'unsafe-inline'" : ''};
    img-src 'self' data: blob:;
    font-src 'self' fonts.googleapis.com fonts.gstatic.com;
    connect-src 'self' fcm.googleapis.com push.services.mozilla.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    worker-src 'self';
    upgrade-insecure-requests;
    block-all-mixed-content;
  `.replace(/\s{2,}/g, ' ').trim();

    // Set security headers 
    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

    // Pass nonce in headers + cookie (optional for client to read)
    res.headers.set('X-Nonce', nonce);
    res.cookies.set('csp-nonce', nonce, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    });

    return res;
}

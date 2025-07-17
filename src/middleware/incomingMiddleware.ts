

// import { NextRequest, NextResponse } from 'next/server';

// // lib/urlSanitizer.ts

// export function isUrlPolluted(searchParams: URLSearchParams): boolean {
//     const seen = new Set<string>();
//     for (const [key] of searchParams.entries()) {
//         if (seen.has(key)) return true;
//         seen.add(key);
//     }
//     return false;
// }

// export function sanitizeQueryParams(searchParams: URLSearchParams): URLSearchParams {
//     const sanitized = new URLSearchParams();
//     for (const [key, value] of searchParams.entries()) {
//         sanitized.append(key, sanitize(value));
//     }
//     return sanitized;
// }

// function sanitize(value: string): string {
//     return value.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
// }



// export function incomingMiddleware(req: NextRequest): NextResponse | null {
//   const url = req.nextUrl;
//   const originalParams = url.searchParams;

//   // 🚨 1. Check for duplicate query parameters
//   if (isUrlPolluted(originalParams)) {
//     return NextResponse.redirect(new URL('/404', req.url));
//   }

//   // 🧼 2. Sanitize query params
//   const sanitizedParams = sanitizeQueryParams(originalParams);
//   const sanitizedQuery = sanitizedParams.toString();
//   const originalQuery = originalParams.toString();

//   // 🔁 If changed, redirect to cleaned version
//   if (sanitizedQuery !== originalQuery) {
//     const cleanUrl = new URL(url.pathname, req.url);
//     cleanUrl.search = sanitizedQuery;
//     return NextResponse.redirect(cleanUrl);
//   }

//   return null; // Nothing to do, continue as normal
// }
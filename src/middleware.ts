import { NextRequest, NextResponse } from 'next/server';
import { sqlInjectionMiddleware } from '@/middleware/sqlInjectionMiddleware';
import { imageValidationMiddleware } from '@/middleware/imageValidationMiddleware';
import { cspMiddleware } from '@/middleware/cspMiddleware';

const runMiddlewares = (
  req: NextRequest,
  middlewares: ((req: NextRequest) => NextResponse | void)[]
): NextResponse => {
  for (const middleware of middlewares) {
    const result = middleware(req);
    if (result) return result;
  }
  return NextResponse.next();
};
export function middleware(req: NextRequest) {
  // Run all functional middlewares and get the base response
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  runMiddlewares(req, [
    sqlInjectionMiddleware,
    imageValidationMiddleware,
  ]);

  // Ensure we always get a NextResponse
  const baseResponse = NextResponse.next();

  // Add CSP and security headers to the response
  const cspResponse = cspMiddleware(baseResponse);


  return cspResponse;
}


export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

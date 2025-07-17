import { NextRequest, NextResponse } from 'next/server';

const SQL_INJECTION_PATTERNS = [
  'select ', 'insert ', 'update ', 'delete ', 'drop ',
  'union ', 'exec ', '--', ';', '/*', '*/',
  '@@', '@', 'char(', 'nchar(', 'varchar(', 'alter ', 'cast(', 'convert(', 'xp_',
];


const isSqlInjectionAttempt = (input: string) => {
  const lowered = input.toLowerCase();
  return SQL_INJECTION_PATTERNS.some(pattern => lowered.includes(pattern));
};

export function sqlInjectionMiddleware(req: NextRequest): NextResponse | void {
  const url = req.nextUrl;
  const queries = Array.from(url.searchParams.values());

  // Check URL path
  if (isSqlInjectionAttempt(url.pathname)) {
    return new NextResponse('Suspicious path pattern', { status: 403 });
  }

  // Check query params
  for (const val of queries) {
    if (isSqlInjectionAttempt(val)) {
      return new NextResponse('SQL injection detected in query', { status: 403 });
    }
  }

  // Optional: Check headers
  const userAgent = req.headers.get('user-agent') || '';
  if (isSqlInjectionAttempt(userAgent)) {
    return new NextResponse('Suspicious User-Agent', { status: 403 });
  }

  // Optional: future support for checking POST body (only possible in API handlers, not middleware)
}

import { NextRequest, NextResponse } from 'next/server';

export function imageValidationMiddleware(req: NextRequest): NextResponse | void {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === '/_next/image') {
    const w = searchParams.get('w');
    if (w && (!/^\d+$/.test(w) || parseInt(w) > 2000)) {
      return new NextResponse('Invalid width', { status: 400 });
    }
  }
}

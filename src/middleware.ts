import  {NextRequest, NextResponse }from 'next/server'
import { verifyJwt, signinJwt } from './lib/jwt'
import {JwtPayload}  from  'jsonwebtoken'

export const config = {
  matcher: ['/home','/api/me']
}

export async function middleware(req: NextRequest) {
  const jwt = req.cookies.get('token')?.value;
  // console.log('JWT from cookie:', jwt);

  if (!jwt) {
    // console.log('No JWT found. Redirecting.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const payload = await verifyJwt(jwt) as JwtPayload;
    // console.log('Decoded payload:', payload);

    if (!payload?.id) {
      // console.log('No valid payload ID found. Redirecting.');
      return NextResponse.redirect(new URL('/', req.url));
    }

    const requestHeaders = new Headers(req.headers);
    // console.log(payload.id)
    requestHeaders.set('X-user-id', payload.id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error('JWT Verification failed:', err);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
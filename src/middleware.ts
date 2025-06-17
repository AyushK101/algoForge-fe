// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { tokenService } from '@/lib/services/tokenService'; 
// import  prisma  from '@/db';             // adjust import to your setup

export const config = {
  matcher: ['/admin/:path*'],
};

async function adminAuth(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken');
  const refreshToken = req.cookies.get('refreshToken');
  const url = new URL('/', req.url);
  // console.log(accessToken,refreshToken)
  if(!accessToken && !refreshToken) return NextResponse.redirect(url);

  // if (accessToken) {
  //   const payload = await tokenService.verifyAccessToken(accessToken.value);
  //   if (!payload) return NextResponse.redirect(url);
  //   userId = payload.userId;
  // } else if (refreshToken) {
  //   const payload = await tokenService.verifyRefreshToken(refreshToken.value);
  //   if (!payload) return NextResponse.redirect(url);

    // userId = payload.userId;

    // Set new access token
    // const newAccessToken = await tokenService.signAccessToken(payload);
    // const response = NextResponse.next();

    // response.cookies.set('accessToken', newAccessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   path: '/',
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 // 1 hour
    // });

    // Check if user is admin
  //   const user = await prisma.user.findUnique({ where: { id: userId } });
  //   if (!user || user.role !== 'ADMIN') return NextResponse.redirect(url);

  //   return response;
  // } else {
  //   return NextResponse.redirect(url);
  // }

  // // Final admin role check (if accessToken existed and userId was extracted)
  // const user = await prisma.user.findUnique({ where: { id: userId } });
  // if (!user || user.role !== 'ADMIN') return NextResponse.redirect(url);

  // return NextResponse.redirect(new URL('/',req.url));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    return await adminAuth(req);
  }

  

  return NextResponse.next();
}

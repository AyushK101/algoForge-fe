import prisma from '@/db';
import { cache } from '@/db/cache';
import { signJWTFunction, verifySignedJwt } from '@/lib/jwtHelper';
import { tokenService } from '@/lib/services/tokenService';
import { RedisKeyTypes } from '@/types';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const removeCookieConf = {
  name: 'refreshToken',
  value: '',
  path: '/',
  maxAge: 0,
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};

export async function GET() {
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken');
  if (!refreshToken) {
    return NextResponse.json({
      success: false,
      error: 'refreshToken not present',
    });
  }

  const jwt = await tokenService.verifyRefreshToken(refreshToken.value);
  // console.log({jwt})
  if (!jwt) {
    const response = NextResponse.json({
      success: false,
      error: 'jwt verification failed',
    });
    response.cookies.set({
      name: 'refreshToken',
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return response;
  }

  // for invalidation check like logout



  const user = await prisma.user.findFirst({
    where: {
      id: jwt.userId,
    },
  });

  if (!user) {
    const response = NextResponse.json({
      success: false,
      error: 'refresh token is invalidated due to user action like logout',
    });
    response.cookies.set({
      name: 'refreshToken',
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return response;
  }
  return NextResponse.json({
    success: true,
    user
  });
}

import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { tokenService } from '@/lib/services/tokenService';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  pictureId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session?.user?.email) {
    return NextResponse.json({
      success: false,
      error: 'email not found in session',
    });
  }

  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username: session.user.name ?? '',
        pictureId: session.user.image ?? '',
        email: session.user.email,
        role: 'USER',
      },
    });
  }

  const accessToken = await tokenService.signAccessToken({
    userId: user.id,
    role: 'USER',
  });

  const refreshToken = await tokenService.signRefreshToken({
    userId: user.id,
    role: 'USER',
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  const response = NextResponse.redirect(String(new URL('/', req.url)))
  console.log({url: String(new URL('/',req.url))})
  // response.headers.set(
  //   'Set-Cookie',
  //   [
  //     serialize('accessToken', accessToken, {
  //       ...options,
  //       maxAge: 60 * 60 * 24 * 7,
  //     }),
  //     serialize('refreshToken', refreshToken, {
  //       ...options,
  //       maxAge: 60 * 60 * 24 * 30,
  //     }),
  //   ].join('; '),
  // );
  const res = NextResponse.json({ success: true });

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

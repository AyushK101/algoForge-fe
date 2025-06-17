import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { tokenService } from '@/lib/services/tokenService';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { string, z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  pictureId: z.string().optional(),
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;


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

  enum ROLE {
    ADMIN= 'ADMIN',
    USER='USER'
  }

  let role: ROLE = ROLE.USER;
  if(!ADMIN_EMAIL) {
    console.log('admin_email undefined');
    process.exit();
  }
  if(session.user.email == ADMIN_EMAIL) {
    role = ROLE.ADMIN;
  }
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: session.user.name ?? '',
        pictureId: session.user.image ?? '',
        email: session.user.email,
        role: role,
      },
    });
  }

  const accessToken = await tokenService.signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = await tokenService.signRefreshToken({
    userId: user.id,
    role: user.role,
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  let response: NextResponse;
  if(user.role == 'ADMIN') {
    response = NextResponse.redirect(String(new URL('/admin', req.url)))
  } else {
    response = NextResponse.redirect(String(new URL('/', req.url)))
  } 
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
  const res = NextResponse.json({ success: true, message: "assigned custom access & refresh tokens" });

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

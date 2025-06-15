import prisma from '@/db';
import { tokenService } from '@/lib/services/tokenService';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  pictureId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  // console.log({jsonString});
  // const json = JSON.parse(jsonString?.body);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.format() },
      { status: 400 },
    );
  }
  const { email, username, pictureId } = parsed.data;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        pictureId: pictureId ?? '',
        email,
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

  const response = NextResponse.json({
    success: true,
    user,
    accessToken,
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

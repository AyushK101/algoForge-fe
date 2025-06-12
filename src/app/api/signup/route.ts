import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { emailAuthSchema } from '@/actions/auth/schema';
import { signinJwt } from '@/lib/jwt';
import prisma from '@/db';

export async function POST(req: Request) {
  const body = await req.json(); // ✅ req.body is a ReadableStream — parse with req.json()
  const data = emailAuthSchema.safeParse(body);

  if (!data.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { email, password } = data.data;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email, password, salt: 'salt' },
    });
  }

  const token = await signinJwt({ id: user.id });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email },
  });

  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
  });

  return response;
}

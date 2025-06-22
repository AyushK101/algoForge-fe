import prisma from '@/db';
import { cache } from '@/lib/cache';
import { tokenService } from '@/lib/services/tokenService';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: { problemId: string } },
) {
  const { problemId } = await context.params;
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.redirect('/invalidsession', { status: 401 });
  }

  let payload;
  try {
    payload = await tokenService.verifyRefreshToken(refreshToken);
    if (!payload) throw new Error('Invalid refresh token');
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.redirect('/invalidsession', { status: 401 });
  }

  const userId = payload.userId;
  let submissions: Array<object> | null = null;
  let cacheStatus = 'fetched from cache';

  try {
    submissions = await cache.get('submission', [problemId, userId]);
  } catch (err) {
    console.warn('Redis cache failed:', err);
  }

  if (!submissions || submissions.length === 0) {
    try {
      submissions = await prisma.submission.findMany({
        where: { problemId, userId },
      });
      cacheStatus = 'fetched from db';

      // Cache fresh data for future requests
      try {
        await cache.set('submission', [problemId, userId], submissions);
      } catch (err) {
        console.warn('Failed to cache data:', err);
      }

    } catch (err) {
      console.error('DB query failed:', err);
      return NextResponse.json({ success: false, message: 'DB error' }, { status: 500 });
    }
  }

  const response = NextResponse.json({
    success: true,
    submissions,
  });

  response.headers.set('X-is-cached', cacheStatus);
  return response;
}

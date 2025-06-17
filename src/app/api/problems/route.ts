import prisma from '@/db';
import { cache } from '@/db/cache';
import { problemType } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

type x = problemType;
// File: /app/api/problems/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // const problems = await getProblemsFromDB({ page, limit }); // replace with real DB call

  // const problems: problemType[] = [
  //   { name: 'two sum', difficulty: 'easy', solved: true, problemId: 1 },
  // ];

  let problems;

  const cachedProblems = await cache.get('problems', [
    page.toString(),
    limit.toString(),
  ]);
  let message = 'fetched from db';
  // console.log({ cachedProblems });
  if (!cachedProblems) {
    problems = await prisma.problem.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  } else {
    problems = cachedProblems;
    message = 'fetched from cache';
  }

  // console.log({ problems });
  const res = await cache.set(
    'problems',
    [page.toString(), limit.toString()],
    problems,
  );
  console.log(res);
  const response = NextResponse.json(
    {
      success: true,
      problems,
    },
    { status: 200 },
  );
  response.headers.set('X-is-cached', message);
  return response;
}

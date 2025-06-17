import prisma from '@/db';
import { tokenService } from '@/lib/services/tokenService';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import z from 'zod';

const problemSchema = z.object({
  title: z.string().min(4, 'min 4 title'),
  description: z.string().min(6, 'desc min 6 req'),
  difficulty: z.enum(['easy','medium','hard']),
  testCases: z
    .array(z.object({ input: z.string(), output: z.string() }))
    .min(1, 'min 1 test case required'),
});


const adminAuth = async (refreshToken: string) => {
    const payload = await tokenService.verifyRefreshToken(refreshToken);
    if(!payload) return false;
    else {
      return (payload.role != 'ADMIN' ? false : true);
    }
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = problemSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'invalid payload type',
      },
      { status: 400 },
    );
  }

  //admin-auth
  const cookie = await cookies()
  let refreshToken = cookie.get('refreshToken');
  if(!refreshToken) return NextResponse.json({
    success: false,
    error: 'refreshToken not present'
  },{ status: 200});

  const isAdmin = adminAuth(refreshToken?.value)
  if(!isAdmin) return NextResponse.json({
    success: false,
    error: 'refresh token verification failed or non admin user'
  })

  const { testCases, title, description, difficulty } = parsed.data;
  const problem = await prisma.problem.create({
    data: {
      title,
      description,
      difficulty
    },
  });
  if (!problem) {
    return NextResponse.json(
      {
        success: false,
        error: 'failed to create problem',
      },
      { status: 500 },
    );
  }

  const problemIdAddedTestcases = testCases.map((t) => {
    return {
      problemId: problem.id,
      ...t,
    };
  });
  const createdTestcases = await prisma.testcase.createMany({
    data: [...problemIdAddedTestcases],
  });

  if (!createdTestcases) {
    await prisma.problem.delete({ where: { id: problem.id } });
    return NextResponse.json(
      {
        success: false,
        error: 'failed to register testCases',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: 'successfully created'
  },{status: 200})
}

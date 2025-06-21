import prisma from '@/db';
import { tokenService } from '@/lib/services/tokenService';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import z from 'zod';

const submissionSchema = z.object({
  source_code: z.string(),
  problemId: z.string(),
  stdin: z.string(),
  expected_output: z.string(),
  language_id: z.number(),
  cpu_time_limit: z.number().optional(),
  memory_limit: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const cookie = await cookies();
  let accessToken = cookie.get('accessToken')?.value!;
  const refreshToken = cookie.get('refreshToken')!;
  let payload = await tokenService.verifyAccessToken(accessToken);

  if (!payload) {
    payload = await tokenService.verifyRefreshToken(refreshToken.value);
    if (!payload) {
      return NextResponse.redirect(new URL('/invalidsession', req.url));
    }
    accessToken = await tokenService.signAccessToken(payload);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'user not found',
      },
      { status: 400 },
    );
  }
  const body = await req.json();
  // console.log(body)
  const {success, data, error}= submissionSchema.safeParse(body);
  if (!success) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: 'invalid submission payload',
      },
      { status: 400 },
    );
  }

  // const submission = await prisma.submission.create({
  //     data: {
  //       source_code:
  //     }
  //   })

  // do long polling here
  const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
  console.log(JUDGE0_API_URL);
  try {
    const res = await axios.post(
      `http://${JUDGE0_API_URL}/submissions/?base64_encoded=true&wait=true`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(res);

    const submission = await prisma.submission.create({
      data: {
        source_code: data.source_code,
        problemId: data.problemId,
        userId: payload.userId,
        
      }
    })

    const response = NextResponse.json(
      {
        success: true,
        message: res.data,
      },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}

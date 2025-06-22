import prisma from '@/db';
import { cache } from '@/lib/cache';
import { tokenService } from '@/lib/services/tokenService';
import { submissionSchema } from '@/types';
import { Submission } from '@prisma/client';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import z, { number } from 'zod';

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
  const {
    success,
    data: inputPayload,
    error,
  } = submissionSchema.safeParse(body);
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
  // console.log(JUDGE0_API_URL);

  const submitPayload = {
    ...inputPayload,
    language_id: inputPayload.language.id,
  };

  console.log({ submitPayload });
  try {
    const {
      data,
    }: {
      data: {
        stdout: string;
        time: string;
        memory: number;
        stderr: string | null;
        token: string;
        compile_output: string | null;
        message: string | null;
        status: {
          id: number;
          description: string;
        };
      };
    } = await axios.post(
      `${JUDGE0_API_URL}/submissions/?base64_encoded=true&wait=true`,
      submitPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(data);

    const submission = await prisma.submission.create({
      data: {
        source_code: inputPayload.source_code,
        userId: user.id,
        problemId: inputPayload.problemId,
        memory: data.memory || -1,
        time: data.time || '-1',
        stdout: data.stdout || '',
        token: data.token,
        compile_output: data.compile_output || '',
        message: data.message || '',
        stderr: data.stderr || '',
        status: data.status.description,
        language: inputPayload.language.name,
        // user: {
        //   connect: { id: user.id },
        // },
      },
    });

    await cache.evict('submission',[inputPayload.problemId,user.id]);

    const response = NextResponse.json(
      {
        success: true,
        submission,
      },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.log({ error });
  }
}

import prisma from '@/db';
import { cache } from '@/db/cache';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
if(!JUDGE0_API_URL) {
  console.log('judge0 api url required')
  process.exit(1);
}
export async function GET(
  req: NextRequest,
  context: { params: { problemId: string } },
) {
  // console.log({context})

  const { problemId } = await context.params;

  let problem = await cache.get('problem', [problemId]);
  let testCases = await cache.get('testCases', [problemId]);
  let languages = await cache.get('languages',[]);//NOTE assuming languages are available for all
  let headMsg = 'fetched from cache';
  if (!problem || !testCases || !languages) {
    const [dbProblem, dbTestCases, dbLanguages ] = await Promise.all([
      !problem
        ? prisma.problem.findUnique({ where: { id: problemId } })
        : Promise.resolve(problem),
      !testCases
        ? prisma.testcase.findMany({ where: { problemId } })
        : Promise.resolve(testCases),
      !languages
        ? axios.get(`${JUDGE0_API_URL}/languages/all`).then( res => res.data)
        : Promise.resolve(languages)
    ]);

    if (!dbProblem && (!dbTestCases || dbTestCases.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Invalid problemId' },
        { status: 400 },
      );
    }
    problem = dbProblem ;
    testCases = dbTestCases ;
    languages = dbLanguages;
    headMsg = 'fetched from cache'
  }

    await Promise.all([
    !problem ? cache.set('problem', [problemId], problem) : Promise.resolve(),
    !testCases ? cache.set('testCases', [problemId], testCases) : Promise.resolve(),
    !languages ? cache.set('languages',[],languages) : Promise.resolve()
  ]);

  const response = NextResponse.json(
    {
      success: true,
      problem: {
        problem,
        testCases,
        languages
      }
    },
    { status: 200 },
  );

  response.headers.set('X-is-cached', headMsg);
  return response;
}

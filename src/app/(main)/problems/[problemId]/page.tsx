// app/problems/[problemId]/page.tsx
import ProblemClient from '@/components/ProblemClient'
import { problemType } from '@/types'
import { notFound } from 'next/navigation'

const Page = async ({ params }: { params: { problemId: string } }) => {
  const futureParams = await params;
  const problemId = futureParams.problemId;
  let problem: problemType | null = null;

  try {
    const res = await fetch(`http://localhost:3000/api/problems/${problemId}`, {
      // Prevent Next.js caching issues
      cache: 'no-store'
    });

    const data = await res.json();

    if (!data.success) {
      console.error('Problem fetch error:', data.error);
      return notFound(); // redirect to /404
    }

    problem = data.problem;
  } catch (error) {
    console.error('Problem fetch failed:', error);
    return notFound(); // fallback
  }

  if (!problem) return null;

  return (
    <ProblemClient problem={problem} />
  );
};

export default Page;

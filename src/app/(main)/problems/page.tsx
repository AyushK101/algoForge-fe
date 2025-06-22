'use client'

import ProblemItem from '@/components/ProblemItem'
import { Button } from '@/components/ui/button'
import { problemType } from '@/types'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import Loading from './loading'
import Container from '@/components/Container'
import { Skeleton } from '@/components/ui/skeleton'

const ProblemsPage = () => {
  const [problems, setProblems] = useState<problemType['problem'][]>([]);
  const page = Number(useSearchParams().get('page') || 1);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const router = useRouter();

  useEffect(() => {
    async function populate() {
      try {
        setLoading(true);
        const result = await axios.get<string, { data: { problems: problemType['problem'][] } }>(
          `/api/problems?page=${page}&limit=${limit}`
        );
        // console.log(result.data.problems)
        setProblems(result.data.problems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    populate();
  }, [page]);

  const goPrev = () => {
    router.push(`?page=${Math.max(1, page - 1)}&limit=${limit}`);
  };

  const goNext = () => {
    router.push(`?page=${page + 1}&limit=${limit}`);
  };

  return (
    <div className="flex flex-col items-center justify-center sm:pt-20 p-4">
      <div className="w-full max-w-4xl overflow-x-auto rounded shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className=" text-left">
              <th className="px-4 py-2 text-sm font-semibold">Title</th>
              <th className="px-4 py-2 text-sm font-semibold">Difficulty</th>
              <th className="px-4 py-2 text-sm font-semibold">Solved</th>
              <th className="px-4 py-2 text-sm font-semibold">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))
            ) : (
              problems?.map((problem) => {
                // console.log(problem)
                return <ProblemItem key={problem.id} {...problem} />
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Container className="flex justify-center items-center gap-4 mt-6">
        <Button onClick={goPrev} disabled={loading || page === 1}>
          Previous
        </Button>
        <span className="text-lg font-medium">{page}</span>
        <Button onClick={goNext} disabled={loading || problems?.length < limit}>
          Next
        </Button>
      </Container>
    </div>
  );
};

export default ProblemsPage;

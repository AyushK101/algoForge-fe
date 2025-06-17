'use client'

import ProblemItem from '@/components/ProblemItem'
import { Button } from '@/components/ui/button'
import { problemType } from '@/types'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ProblemsPage = ({ problemsR }: { problemsR: problemType[] }) => {
  const [problems, setProblems] = useState<problemType[]>(problemsR);
  const page = Number(useSearchParams().get('page') || 1);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const router = useRouter();

  useEffect(() => {
    async function populate() {
      try {
        setLoading(true);
        const result = await axios.get<string, { data: { problems: problemType[] } }>(
          `/api/problems?page=${page}&limit=${limit}`
        );
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
            {problems.map(problem => (
              <ProblemItem key={problem.id} {...problem} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-6">
        <Button onClick={goPrev} disabled={loading || page === 1}>
          Previous
        </Button>
        <span className="text-lg font-medium">{page}</span>
        <Button onClick={goNext} disabled={loading || problems.length < limit}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProblemsPage;

'use client';

import React from 'react';
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { problemType } from '@/types';

const ProblemItem = ({ title, difficulty, id }: problemType['problem']) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/problems/${id}`); // ✅ Added leading slash
  };
  
  let solved = true;

  return (
    <tr className="border-b">
      <td className="px-4 py-2">{title}</td>
      <td className="px-4 py-2">{difficulty}</td>
      <td className="px-4 py-2">
        {solved && <HiMiniArrowTrendingUp className="text-green-500" />}
      </td>
      <td className="px-4 py-2">
        <Button onClick={handleRedirect}>Solve</Button>
      </td>
    </tr>
  );
};

export default ProblemItem;

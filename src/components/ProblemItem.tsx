'use client'
import React from 'react'
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { problemType } from '@/types';


const ProblemItem = ({ title, difficulty, id }: problemType) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`problems/${id}`);
  }
  let solved = true;
  return (  
    <>
      <tr className='flex justify-center gap-5 p-2 m-2'>
        <td>{title}</td>
        <td>{difficulty}</td>
        <td>{solved ? <HiMiniArrowTrendingUp color='green' /> : ''}</td>
        <td>{difficulty}</td>
        <td><Button onClick={handleRedirect}>solve</Button></td>
      </tr>
    </>
  )
}

export default ProblemItem
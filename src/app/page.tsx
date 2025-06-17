

import React from 'react'
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import  Link  from 'next/link';
const page = () => {

  return (
    <>

      <div className='sm:pt-17'></div>
      <div className='flex justify-center p-20' id='page'>
        <div className='flex flex-col w-fit items-start justify-center p-2 m-2 gap-4'>
          <h1 className='text-4xl font-extrabold'>Welcome to AlgoForge</h1>
          <p className='max-w-2xl text-wrap'>AlgoForge is a platform for holding contents. Practice in challenges, solve problems, and climb the leaderboard.</p>
          <div className='flex gap-3'>
            <Link href={'/contests'}><Button >view Contests</Button></Link>
             <Link href={'/problems'}><Button className="bg-white text-black border">View Problems</Button></Link>
          </div>
        </div>
      </div>
      <div className='h-screen'></div>
    </>
  )
}

export default page
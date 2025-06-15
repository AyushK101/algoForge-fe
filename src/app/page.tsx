

import React from 'react'
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
const page = () => {

  return (
    <>
      <Header />
      <div className='sm:pt-17'></div>
      <div className=' flex  ' id='page'>
        <div className='flex flex-col w-fit items-start justify-center p-2 m-2 gap-4'>
          <h1 className='text-4xl font-extrabold'>Welcome to AlgoForge</h1>
          <p className='max-w-2xl text-wrap'>AlgoForge is a platform for holding contents. Practice in challenges, solve problems, and climb the leaderboard.</p>
          <div className='flex gap-3'>
            <Button>view Contests</Button>
            <Button className="bg-white text-black border">View Problems</Button>
          </div>
        </div>
        <div>
          <Image priority src={'/home.avif'} height={200} width={500} alt='homeImage' className='rounded shadow-xl m-5 hidden md:block' />
        </div>
      </div>
    </>
  )
}

export default page
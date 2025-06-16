'use client'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import  Container  from "@/components/Container"
import ToggleMode from '@/components/ToggleTheme'
import Profile from './Profile'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import AuthButton from './AuthButton'

const Header = () => {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    <>
      <div className='w-full p-2  bg-slate-900 ht-0  sm:fixed'>
        <Container className='flex flex-wrap justify-between items-center'>
        <div className="flex justify-center items-center  gap-4 flex-wrap">
          <Image priority src={'/android-chrome-512x512.png'} alt="logo" height={50} width={50} />
          <h1 className="text-3xl font-extrabold text-white">AlgoForge</h1>
        </div>
        <div className='flex gap-2 flex-wrap items-center justify-center'>
          <Button className='bg-transparent text-white text-md hover:bg-slate-500'>Contests</Button>
          <Button className='bg-transparent text-white text-md hover:bg-slate-500'>Problems</Button>
          <Button className='bg-transparent text-white text-md hover:bg-slate-500'>Standings</Button>
        </div>
        <ToggleMode/>
        <Profile/>
        {/* {user.user ? (
        <Button className='bg-white text-black hover:bg-blue-400' onClick={()=>{}}>login</Button>
        ) : (
        <Button className='bg-white text-black hover:bg-blue-400' onClick={()=>{}}>logout</Button>
          
        )} */}
        <AuthButton/>
        </Container>
      </div>
    </>
  )
}

export default Header
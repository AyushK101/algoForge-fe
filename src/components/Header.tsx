'use client'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Container from "@/components/Container"
import ToggleMode from '@/components/ToggleTheme'
import Profile from './Profile'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import AuthButton from './AuthButton'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'

const Header = () => {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    <>
      <div className='w-full p-2  bg-slate-900 ht-0   border-b-2'>
        <Container className='flex flex-wrap justify-around md:justify-between items-center'>
          <div className="flex justify-center items-center  gap-4 flex-wrap">
            <Link href={'/'}><Image priority src={'/android-chrome-512x512.png'} alt="logo" height={50} width={50} /></Link>
            <Link href={'/'}>  <h1 className="text-3xl font-extrabold text-white">AlgoForge</h1> </Link>

          </div>
          <div className='flex gap-2 flex-wrap items-center justify-center'>

            <Link href={'/contests'}  ><Button className='bg-transparent text-white text-md hover:bg-slate-500 hidden md:block' >Contests</Button></Link>
            <Link href={'/problems'} ><Button className='bg-transparent text-white text-md hover:bg-slate-500 hidden md:block' >Problems</Button></Link>
            <Link href={'/standings'} ><Button className='bg-transparent text-white text-md hover:bg-slate-500' >Standings</Button></Link>
            {/* <Button className='bg-transparent text-white text-md hover:bg-slate-500'>Standings</Button> */}
          </div>
          <div className='flex flex-wrap gap-2 justify-center items-center'>
            {user.user?.role == 'ADMIN' ? <Link href={'/admin'}><PlusIcon /></Link> : ''}
            <Profile />
            <AuthButton />
            <ToggleMode />
          </div>
        </Container>

      </div>
    </>
  )
}
{/* {user.user ? (
        <Button className='bg-white text-black hover:bg-blue-400' onClick={()=>{}}>login</Button>
        ) : (
        <Button className='bg-white text-black hover:bg-blue-400' onClick={()=>{}}>logout</Button>
          
        )} */}
export default Header
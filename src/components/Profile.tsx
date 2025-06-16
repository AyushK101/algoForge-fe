'use client'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import Image from 'next/image'
import React from 'react'
import { FaUser } from 'react-icons/fa'

const Profile = () => {
  const user = useAppSelector((state: RootState) => state.user);
  // console.log(user);
  return (
    //@ts-ignore
    <div className='flex gap-2 items-center'>

      <div className='text-white  '>{user.user?.pictureId ? <Image priority className='rounded-full' src={user.user?.pictureId} height={50} width={50} alt='user' /> : <FaUser className='' size={20} />}
      </div>

      <p className='text-white font-semibold '>{user.user?.username}</p>
    </div>
  )

}

export default Profile
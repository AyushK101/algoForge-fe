'use client'
import useGetCurrentUserHook from '@/hooks/useGetCurrentUserHook'
import React from 'react'

const ClientAuthSync = () => {
    useGetCurrentUserHook()
  return null
}

export default ClientAuthSync
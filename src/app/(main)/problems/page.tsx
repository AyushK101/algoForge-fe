import ProblemsPage from '@/Pages/ProblemsPage'
import React from 'react'
import axios from 'axios'
import { problemType } from '@/types'
const page = async ({ searchParams }: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  // const limit = await searchParams.limit || 10;
  // const page  = await searchParams.page || 1;
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// const res = await axios.get<string, { data: { problems: problemType[] } }>(
//   `${BASE_URL}/api/problems?page=1&limit=10`
// );
  return (
    <ProblemsPage problemsR={ []} />
  )
}

export default page
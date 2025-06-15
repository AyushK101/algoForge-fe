'use client'
import { setUser } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import axios from "axios";
import { useEffect, useRef } from "react";
import { toast } from "sonner";



export default function useGetCurrentUserHook(): null {
  const user = useAppSelector((store: RootState) => store.user);
  const dispatch = useAppDispatch();
  const ref = useRef(false);
  useEffect(() => {

    async function init() {
      const response = await axios.get<any, { data: { success: boolean, user?: any, error?: string, accessToken: string }, error: string }>('/api/me', {
        withCredentials: true,
      })
      console.log({ response })
      toast(`user fetched`)
      if (!response.data?.success) {
        toast(`${response.data.error}`)
      } else {
        dispatch(setUser({ user: response.data.user, accessToken: response.data.accessToken }));
      }
      console.log({ref})
    }
    if (!ref.current) init()
  }, [])
  return null
}
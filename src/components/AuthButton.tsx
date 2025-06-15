'use client'
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Button } from "./ui/button";
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setUser, unsetUser } from "@/store/features/userSlice";
import { toast } from "sonner";
import { RootState } from "@/store/store";

export default function AuthButton() {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const user = useAppSelector((state: RootState) => state.user);
  /**
   * @summary this useEffect is used to get the user once when user call singIn('provider')
   * so that custom refresh token is provided to user in cookie. It should NOT be called 
   * simultaneously with GET /api/auth/session.
   */
  useEffect(() => {
    async function init() {
      const alreadyInitialized = sessionStorage.getItem('custom-auth-init');
      const userInitialized = !!user?.user && !!user?.accessToken;

      console.log({ status, email: session?.user?.email, alreadyInitialized, userInitialized });

      if (
        status === 'authenticated' &&
        session?.user?.email &&
        !alreadyInitialized &&
        !userInitialized
      ) {
        try {
          console.log("🔐 Calling /api/custom-auth");
          const res = await axios.post("/api/custom-auth", {
            email: session.user.email,
            username: session.user.name,
            pictureId: session.user.image,
          }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          });

          const { success, user, accessToken, error } = res.data;

          if (success) {
            dispatch(setUser({ user, accessToken }));
            sessionStorage.setItem('custom-auth-init', 'true');
            //@ts-ignore
            toast(`${user?.username} logged in successfully!`);
          } else {
            toast(`Auth failed: ${error}`);
          }

        } catch (error) {
          console.error("custom-auth error:", error);
        }
      }
    }

    if(!user.user) init();
  }, [session, status, user]);


  if (session) {
    return (
      <>
        <Button onClick={async () => {
          sessionStorage.removeItem('custom-auth-init')
          await Promise.all([
            axios.post('/api/logout'),
            signOut(),
            dispatch(unsetUser())
          ])
        }} className="hover:bg-slate-400 bg-white text-lg text-black">Sign out</Button>
      </>
    );
  } else {
    return (
      <div className="flex gap-2">
        <Button className="hover:bg-slate-400 bg-white text-lg text-black" onClick={() => signIn("github")}><FaGithub /></Button>
        {/*  <Button className="hover:bg-slate-400 bg-white text-lg text-black" onClick={() => signIn("google")}><FaGoogle /></Button>*/}
      </div>
    );
  }
}

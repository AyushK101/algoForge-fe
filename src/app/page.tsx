'use client'
import { emailAuthSchema } from "@/actions/auth/schema";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsApple, BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
import { FaArrowLeft, FaArrowRight, FaGoogle } from 'react-icons/fa'
import { toast } from "sonner";
import { CgSpinner } from "react-icons/cg";
import { useRouter } from 'next/navigation';



export default function Home() {
  const [emailAuth, setEmailAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  

  useEffect(() => {
    async function main() {
      const res = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include'
      });
      setLoading(false);
      if (!res.ok) {
        toast('failed to getCurrentUser');
        router.push('/');
        
      } else {
        const data = await res.json();
        console.log(data);
        router.push('/home');
      }
    }
    main()
  }, [])

  const handleEmailAuth = async () => {
    setLoading(true);
    const data = emailAuthSchema.safeParse({ email, password })
    if (!data.success) {
      toast(`${data.error.errors.map(error => error.message)}`);
    } else {
      const payload = { email, password };
      try {
        const result = await fetch('/api/signup', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(payload),
          cache: "no-cache",
        });
        setLoading(false);
        setEmail('');
        setPassword('');
        const body = await result.json();
        console.log(body)
        router.push('/home');
      } catch (err) {
        console.error("Login failed", err);
      }
    }
    setLoading(false);
    setEmail('');
    setPassword('');
  };


  if(loading) return (
    <Container className="flex justify-center items-center w-screen h-screen">
      <Image priority src='/android-chrome-512x512.png' alt={"logo"} height={500} width={500} />
    </Container>
  )

  return (
    <div className="bg-slate-100">
      <Container className="flex flex-col justify-center items-center h-screen">
        <div className="flex justify-center items-center p-2 m-2 gap-4 flex-wrap">
          <Image src={'/android-chrome-512x512.png'} alt="logo" height={100} width={100} priority />
          <h1 className="text-3xl font-extrabold">AlgoForge</h1>
        </div>

        <>

        </>

        <>
          <div className="flex flex-col bg-white  rounded-xl border px-8 items-center p-2 m-2">
            {
              emailAuth ? (
                <>
                  <div className="flex flex-wrap flex-col justify-center gap-2">
                    <h1 className="text-blue-600 font-bold flex gap-1 justify-center items-center p-3 m-3 flex-wrap" onClick={() => setEmailAuth(false)}> <FaArrowLeft />Go Back</h1>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="" placeholder="enter email" className="p-2 m-2 w-full border shadow rounded-xl" />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" placeholder="enter password" className="p-2 m-2 w-full border shadow rounded-xl" />
                    <Button onClick={handleEmailAuth} className={`bg-blue-500 rounded-2xl p-2 m-2 ${loading ? 'disabled' : ''}`}> {loading ? <CgSpinner /> : 'Auth'} </Button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="font-semibold text-2xl pt-2 m-2">Login or Signup </h1>
                  <div className="px-4  py-3 m-3 border rounded-4xl flex flex-wrap gap-4 items-center justify-center bg-blue-500 text-white w-full "><FaGoogle color="white" /> Continue with google</div>
                  <div className="px-4  py-3 m-3 border rounded-4xl flex flex-wrap gap-4 items-center justify-center  w-full"><Lock /> Continue with SSO</div>
                  <div className="flex justify-center items-center gap-3"><hr className="w-1/3 inline flex-1" />OR<hr className="w-1/3 inline flex-1" /></div>
                  <div className="flex flex-wrap justify-center">
                    <div className="border px-7 py-3 m-2 rounded-4xl w-fit"><BsGithub /></div>
                    <div className="border px-7 py-3 m-2 rounded-4xl w-fit"><BsApple /></div>
                    <div className="border px-7 py-3 m-2 rounded-4xl w-fit"><BsTwitter /></div>
                    <div className="border px-7 py-3 m-2 rounded-4xl w-fit"><BsLinkedin /></div>
                  </div>
                  <div onClick={() => setEmailAuth(true)}><span className="text-blue-600 font-bold flex gap-3 justify-center items-center p-3 m-3 flex-wrap">Continue with email <FaArrowRight /></span></div>
                </>
              )
            }

          </div>
        </>


      </Container>
    </div>
  )
}


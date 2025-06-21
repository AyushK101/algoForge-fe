import { Skeleton } from "@/components/ui/skeleton"



export default function Loading() {
  return (
    <div className="flex justify-center gap-2">

      <Skeleton className="h-screen w-1/2 p-2 m-4 rounded-xl shadow-2xl"/>
      <Skeleton className="h-screen w-1/2 p-2 m-4 rounded-xl shadow-2xl"/>
    </div>
  )
}

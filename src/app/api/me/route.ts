import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const id = req.headers.get('X-user-id');
  console.log(id)
  if(!id) {
    return NextResponse.redirect(new URL('/',req.url));
  }

  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  if(!user) {
    return NextResponse.json({
      error: 'user not found'
    })
  }

  return NextResponse.json({
    user
  })
}


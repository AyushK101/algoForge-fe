// 'use server'
// import { cache } from "@/db/cache";
// import { SessionSchemaType } from "./type";
// import crypto from 'crypto'
// import { cookies } from "next/headers";
// import prisma from "@/db";

// export interface Cookies {
//   set(
//     key: string,
//     value: string,
//     options: {
//       secure?: boolean,
//       httpOnly?: boolean,
//       sameSite?: 'lax' | 'none' | 'strict',
//       expires?: number
//     }
//    ): void;
//    get(key: string) : {name: string, value: string} | undefined;
//    delete(key: string) : void


// }

// export async function createUserSession(user: SessionSchemaType) {
//   const sessionId = crypto.randomBytes(512).toString('hex').normalize();
//   await cache.set('sessionId',[sessionId],user, Number(process.env.SESSION_EXPIRATION_S));

//   const cookie = await cookies();
//   cookie.set('sessionId',sessionId,{
//     httpOnly: true,
//     sameSite: 'lax', // lax cookie allow to access cookie on server even if redirected from a diff. page like in Oauth
//     secure: true,
//     path: '/',
//     expires: Date.now() + Number(60 * 60 * 24 * 7)*1000
//   })
// }
// export async function validateSession(): Promise<any> {
//   const cookie = await cookies();
//   const ck = cookie.get('sessionId');
//   const sessionId = ck?.value;
//   if(!sessionId) return Promise.resolve<boolean>(false); 
//   const ckRes: SessionSchemaType = await cache.get('sessionId',[sessionId]);
//   if(ckRes) {
//     const user = getCurrentUser(ckRes);
//     if(user != null) return Promise.resolve<any>(user);
//     else return Promise.resolve<boolean>(false);
//   }
//   else return Promise.resolve<boolean>(false);
// }

// export async function getCurrentUser(session: SessionSchemaType) {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: session.id
//     }
//   })
//   return user;
// }

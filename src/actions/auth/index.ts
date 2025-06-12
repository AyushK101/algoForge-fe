// 'use server'
// import { emailAuthType } from './types';
// import prisma from '@/db';
// import hashPassword, { generateSalt, verifyHash } from '@/lib/hashPasswordHelper';
// import { revalidatePath } from 'next/cache';
// import { createUserSession } from '../session';

 
// const SERVER_BASE_URL = '';

// export async function emailAuthLogin(payload: emailAuthType): Promise<boolean> {
//   const existingUser = await prisma.user.findUnique({
//     where: {
//       email: payload.email,
//     },
//   });

//   if (existingUser != null) {
//     // console.log(existingUser);
//     console.log("verifyHashing hash");
//     const isPasswordCorrect = await verifyHash(payload.password, existingUser.password, existingUser.salt);
//     if(isPasswordCorrect) {
//       createUserSession({id: existingUser.id, role :existingUser.role})
//       return true;
//     }
//     else return false;
//   }
//     const salt = await generateSalt();
//     if(salt instanceof Error) {
//     console.log(salt);
//     return false;
//   }
//   // TODO : add user to redis, for passCheck extract from there.
//   const hashedPassword = await hashPassword(payload.password,salt);
//   if(hashedPassword instanceof Error) return false;
//   const newUser = await prisma.user.create({
//     data: {
//       email: payload.email,
//       password: hashedPassword,
//       salt: salt
//     }
//   })
//   return false;
// }


// export async function emailLogout() {
//   // clearSessionCookie();
// }


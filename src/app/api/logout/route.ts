import { cache } from "@/db/cache";
import { tokenService } from "@/lib/services/tokenService";
import { RedisKeyTypes } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = await cookies(); // no need to `await` here
  const refreshToken = cookie.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.json({
      success: false,
      error: "Refresh token not present",
    });
  }

  const token = await tokenService.verifyRefreshToken(refreshToken.value);

  if (!token) {
    const response = NextResponse.json({
      success: false,
      error: "Token verification failed",
    });
    response.cookies.delete("refreshToken");
    return response;
  }

  const jti = token.jti!;
  const exp = token.exp! * 1000 - Date.now(); // milliseconds remaining
  const expInSec = Math.floor(exp / 1000);
  const safeExp = Math.max(expInSec, 0);

  await cache.set(RedisKeyTypes.BLACKLISTED, [jti], true, safeExp);

  const response = NextResponse.json({
    success: true,
    message: "User logged out and token blacklisted",
  });
  response.cookies.delete("refreshToken");

  return response;
}

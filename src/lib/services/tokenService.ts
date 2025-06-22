// lib/services/TokenService.ts

import * as jose from 'jose';
// import { cache } from '@/db/cache' // Your Redis client instance
import { JWTAccessPayload, JWTRefreshPayload, RedisKeyTypes } from '@/types/index';
import { cache } from '@/lib/cache';

const encoder = new TextEncoder();

interface CustomJwtPayload extends jose.JWTPayload {
  userId: string,
  role: string
}

function parseExpiration(time: string): number {
  const unit = time.slice(-1);
  const value = parseInt(time.slice(0, -1));
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: throw new Error(`Invalid time unit in ${time}`);
  }
}

class TokenService {
  private static instance: TokenService;

  private accessSecret: Uint8Array;
  private refreshSecret: Uint8Array;
  private accessExp: number;
  private refreshExp: number;

  private constructor() {
    this.accessSecret = encoder.encode(process.env.JWT_ACCESS_SECRET!);
    this.refreshSecret = encoder.encode(process.env.JWT_REFRESH_SECRET!);
    this.accessExp = parseExpiration(process.env.ACCESS_TOKEN_EXPIRY || '15m');
    this.refreshExp = parseExpiration(process.env.REFRESH_TOKEN_EXPIRY || '7d');
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  private generateJti(): string {
    return crypto.randomUUID();
  }

  public async signAccessToken(payload: JWTAccessPayload): Promise<string> {
    
  const jti = this.generateJti();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + this.accessExp;
    return new jose.SignJWT({ ...payload, jti })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(this.accessSecret);
  }

  public async signRefreshToken(payload: JWTRefreshPayload): Promise<string> {
  const jti = this.generateJti();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + this.refreshExp;
    return new jose.SignJWT({ ...payload, jti })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(this.refreshSecret);
  }

  public async verifyAccessToken(token: string): Promise<CustomJwtPayload | null> {
    try {
      const { payload }: {payload: CustomJwtPayload} = await jose.jwtVerify(token, this.accessSecret);
      if (await this.isBlacklisted(payload.jti as string)) return null;
      return payload;
    } catch {
      return null;
    }
  }

  public async verifyRefreshToken(token: string): Promise<CustomJwtPayload | null> {
    try {
      debugger
      
      const { payload }: { payload: CustomJwtPayload } = await jose.jwtVerify(token, this.refreshSecret);
      if (await this.isBlacklisted(payload.jti as string)) return null;
      // console.log({payload})
      return payload;
    } catch (err){
      console.log({err})
      return null;
    }
  }

  public async blacklistToken(jti: string, expInSeconds: number): Promise<void> {
    await cache.set(RedisKeyTypes.BLACKLISTED,[jti],true,expInSeconds);
  }

  public async isBlacklisted(jti: string): Promise<boolean> {
    return await cache.get(RedisKeyTypes.BLACKLISTED,[jti]) === 'true';
  }


  public getAccessTokenExpiry(): number {
    return this.accessExp;
  }

  public getRefreshTokenExpiry(): number {
    return this.refreshExp;
  }
}

export const tokenService = TokenService.getInstance();

import * as jose from 'jose';

interface customJwtPayload extends jose.JWTPayload {
  userId: string;
}

//util for both access and refresh
export const signJWTFunction = async (
  payload: customJwtPayload,
  expTime: number | string,
  tokenSecret: string,
): Promise<string> => {
  const secret = new TextEncoder().encode(tokenSecret);
  const token = await new jose.SignJWT({
    ...payload,
    jti: crypto.randomUUID(),
  })
    .setIssuedAt()
    .setExpirationTime(expTime)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .sign(secret);
  return token;
};

export const verifySignedJwt = async (
  jwt: string,
  tokenSecret: string,
): Promise<customJwtPayload | null> => {
  const secret = new TextEncoder().encode(tokenSecret);
  if (process.env.NODE_ENV != 'production') console.log(secret);

  try {
    const { payload }: { payload: customJwtPayload } = await jose.jwtVerify(
      jwt,
      secret,
    );
    return payload;
  } catch (err) {
    console.log(err);
    return null;
  }
};

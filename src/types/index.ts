export enum RedisKeyTypes {
  BLACKLISTED = 'BLACKLISTED',
}

export type JWTAccessPayload = {
  userId: string;
  role: string;
};

export type JWTRefreshPayload = {
  userId: string;
  role: string;
};

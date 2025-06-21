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

export type problemType = {
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    solved?: boolean;
    problemId: number;
    createdAt: string;
    updatedAt: string;
  };
  testCases: Array<{ id: string; input: string; output: string }>;
  languages: Array<{ id: number; name: string }>;
};


export type submissionType = {
  id: string;
  problemId: string;
  language: string;
  source_code: string;
  status: string;
  createdAt: string;
};

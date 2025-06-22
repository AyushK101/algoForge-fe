import z from "zod";

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
  languages: Array<{ id: number; name: string, is_archived: boolean }>;
};


export type submissionType = {
  id: string;
  problemId: string;
  language: string;
  source_code: string;
  status: string;
  createdAt: string;
};



export const submissionSchema = z.object({
  source_code: z.string(),
  problemId: z.string(),
  stdin: z.string(),
  expected_output: z.string(),
  language: z.object({id: z.number(), name: z.string()}),
  cpu_time_limit: z.number().optional(),
  memory_limit: z.number().optional(),
});


export type GetSubmissionType = {
  id: string
  userId: string
  problemId: string
  language: string
  source_code: string
  stdout: string
  time: string
  memory: number
  token: string
  compile_output: string
  message: string
  stderr: string
  createdAt: string
  updatedAt: string
  status: string
}

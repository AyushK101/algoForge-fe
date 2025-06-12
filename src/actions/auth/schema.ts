import z from 'zod'

export const emailAuthSchema = z.object({
  email: z.string().email('not valid email'),
  password: z.string().min(4,"min length should be 4")
})
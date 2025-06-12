import z from 'zod'
import { emailAuthSchema } from './schema'

export type emailAuthType = z.infer<typeof emailAuthSchema>

import { z } from "zod";
import { sessionSchema } from "./schema";

export type SessionSchemaType = z.infer<typeof sessionSchema>;

import { z } from 'zod'

export const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

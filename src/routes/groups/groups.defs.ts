import { z } from 'zod'

const coord = z
  .string()
  .regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/)
  .transform(Number)

export const listGroupsQuery = z
  .object({
    lat: coord,
    long: coord,
    maxDistance: z.string().regex(/^\d+$/).transform(Number),
    order: z.enum(['created', 'updated']),
  })
  .partial()

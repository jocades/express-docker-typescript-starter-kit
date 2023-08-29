import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
})

// get the type of each property
const props = Object.entries(schema.shape).map(([key, value]) => {
  return { [key]: { type: value._def.typeName } }
})

console.log(props)

import { extendApi, generateSchema } from '@anatine/zod-openapi'

const docSchema = generateSchema(schema)

console.log(docSchema)

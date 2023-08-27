import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3).max(255),
})

// get the type of each property
const props = Object.entries(schema.shape).map(([key, value]) => {
  return { [key]: { type: value._def.typeName } }
})

console.log(props)

import { RequestHandler } from 'express'
import { AnyZodObject } from 'zod'

type Validate = (schema: AnyZodObject) => RequestHandler

const validate: Validate = (schema) => {
  return async (req, res, next) => {
    const result = await schema.safeParseAsync(req.body)
    if (!result.success) {
      const path = result.error.issues[0].path.join('.')
      const message = `${path}: ${result.error.issues[0].message}`
      return res.status(400).json({ message })
    }
    req.body = result.data
    next()
  }
}

export default validate

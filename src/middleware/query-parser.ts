import { type RequestHandler } from 'express'
import { type AnyZodObject } from 'zod'

type QueryParser = (query: AnyZodObject) => RequestHandler

const parseQuery: QueryParser = (query) => {
  return async (req, res, next) => {
    const result = await query.safeParseAsync(req.query)
    if (!result.success) {
      return res.status(400).send(result.error)
    }
    req.query = result.data
    next()
  }
}

export default parseQuery

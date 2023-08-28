import { type RequestHandler } from 'express'
import { type AnyZodObject } from 'zod'
import { BadRequest } from '../lib/errors'

type QueryParser = (query: AnyZodObject) => RequestHandler

const parseQuery: QueryParser = (query) => {
  return async (req, res, next) => {
    const result = await query.safeParseAsync(req.query)
    if (!result.success) {
      throw new BadRequest(result.error.message)
    }
    req.query = result.data
    next()
  }
}

export default parseQuery

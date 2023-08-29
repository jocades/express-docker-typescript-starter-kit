import { RequestHandler } from 'express'
import { Types } from 'mongoose'
import { NotFound } from '../lib/errors'

const validateObjectId: RequestHandler = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new NotFound('Invalid ID')
  }
  next()
}

export default validateObjectId

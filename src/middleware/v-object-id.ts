import { RequestHandler } from 'express'
import { Types } from 'mongoose'

const validateObjectId: RequestHandler = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send('Invalid object ID.')
  }
  next()
}

export default validateObjectId

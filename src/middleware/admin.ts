import { RequestHandler } from 'express'
import { Forbidden } from '../lib/errors'

const admin: RequestHandler = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new Forbidden(
      'Forbidden. You are not authorized to access this resource'
    )
  }
  next()
}

export default admin

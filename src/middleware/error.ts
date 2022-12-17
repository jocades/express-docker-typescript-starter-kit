import { ErrorRequestHandler } from 'express'
import logger from '../logger'

const error: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error('Internal server error', err)
  return res.status(500).send({ message: 'Something went wrong.' })
}

export default error

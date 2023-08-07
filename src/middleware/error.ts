import { ErrorRequestHandler } from 'express'
import logger from '../logger'

const error: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error('Internal server error', err)
  res
    .status(err.code ?? 500)
    .send({ message: err.message ?? 'Something went wrong.' })
}

export default error

import { ErrorRequestHandler } from 'express'

const error: ErrorRequestHandler = (err, _req, res, _next) => {
  return res
    .status(err.code ?? 500)
    .send({ msg: err.message ?? 'Internal Server Error' })
}

export default error

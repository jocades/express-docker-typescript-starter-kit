import { type RequestHandler } from 'express'

export const exampleRoute: RequestHandler = (req, res) => {
  res.json({
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body,
  })
}

export const next: RequestHandler = (req, res, next) => next()

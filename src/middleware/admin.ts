import { RequestHandler } from 'express'

const admin: RequestHandler = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).send('Access denied.')
  next()
}

export default admin

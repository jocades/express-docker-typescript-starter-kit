import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')
  if (!token) return res.status(401).send('Unauthorized, no token provided.')

  jwt.verify(token, 'jwtAKey', (err, decoded) => {
    if (err) return res.status(401).send(`Unauthorized, ${err.message}.`)

    req.user = decoded as UserPayload
    next()
  })
}

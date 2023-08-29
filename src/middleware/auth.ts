import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_A_SECRET } from '../config/consts'
import { Unauthorized } from '../lib/errors'

const auth: RequestHandler = (req, res, next) => {
  const token = req.header('Authorization')
  if (!token) throw new Unauthorized('Unauthorized, no token provided.')

  jwt.verify(token, JWT_A_SECRET, (err, decoded) => {
    if (err) throw new Unauthorized(`Unauthorized, ${err.message}.`)

    req.user = decoded as UserPayload
    next()
  })
}

export default auth

import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const accessSecret = process.env.JWT_A_SECRET as string

const auth: RequestHandler = (req, res, next) => {
  const token = req.header('Authorization')
  if (!token) return res.status(401).send('Unauthorized, no token provided.')

  jwt.verify(token, accessSecret, (err, decoded) => {
    if (err) return res.status(401).send(`Unauthorized, ${err.message}.`)

    req.user = decoded as UserPayload
    next()
  })
}

export default auth

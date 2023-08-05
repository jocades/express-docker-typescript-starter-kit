import { Response, RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { decrypt } from '../utils/hash'
import User, { validateUser } from '../models/user.model'

type ReqHandler = RequestHandler<{}, {}, Credentials & Tokens>

const sendMsg = (res: Response, message: string) =>
  res.status(400).send({ message })

export const registerUser: ReqHandler = async (req, res) => {
  const { email, password } = req.body
  const { error } = validateUser(email, password)
  if (error) return sendMsg(res, error.details[0].message)

  let user = await User.findOne({ email })
  if (user) return sendMsg(res, 'User already registered.')

  const hashed = await bcrypt.hash(password, 10)

  user = new User({ email, password: hashed })
  await user.save()

  res.status(201).send(_.pick(user, ['_id', 'email']))
}

export const loginUser: ReqHandler = async (req, res) => {
  const { email, password } = req.body
  const { error } = validateUser(email, password)
  if (error) return sendMsg(res, error.details[0].message)

  const user = await User.findOne({ email })
  if (!user) return sendMsg(res, 'Invalid email or password.')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return sendMsg(res, 'Invalid email or password.')

  const tokens = await user.login()

  res.send(tokens) // Remember this is for a mobile app.
}

const refreshSecret = process.env.JWT_R_SECRET as string

export const logoutUser: ReqHandler = async (req, res) => {
  try {
    const refresh = decrypt(JSON.parse(req.body.refresh))
    const decoded = jwt.verify(refresh, refreshSecret) as UserPayload
    const user = await User.findById(decoded._id)
    if (!user) return res.status(400).send('Bad request.')

    await user.logout(req.body.refresh)

    res.sendStatus(204)
  } catch (err: any) {
    res.status(400).send(err.message)
  }
}

export const refreshUser: ReqHandler = async (req, res) => {
  try {
    const refresh = decrypt(JSON.parse(req.body.refresh))
    const decoded = jwt.verify(refresh, refreshSecret) as UserPayload

    const user = await User.findById(decoded._id)
    if (!user) return res.status(403).send('Access denied.')

    user.refresh(req.body.refresh, (err, tokens) => {
      if (err) return res.status(403).send(err.message)
      res.send(tokens)
    })
  } catch (err: any) {
    res.status(403).send('Access denied.')
  }
}

// In login and others:
// This would be for a cookie-based auth system typical for web browsers:
// const { access, refresh } = await user.login()

// res.cookie('refresh', refresh, {
//   httpOnly: true,
//   sameSite: 'none',
//   secure: true,
//   maxAge: 1000 * 60 * 60 * 24 * 7,
// })

// res.send({ access })

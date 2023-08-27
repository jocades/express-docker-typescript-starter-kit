import { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { decrypt } from '../../utils/hash'
import User from '../../models/user.model'
import { pick } from '../../utils/funcs'
import { BadRequest } from '../../lib/errors'

type ReqHandler = RequestHandler<{}, {}, Credentials & Tokens>

export const registerUser: ReqHandler = async (req, res) => {
  const { email, password } = req.body

  let user = await User.findOne({ email })
  if (user) throw new BadRequest('User already registered.')

  const hashed = await bcrypt.hash(password, 10)

  user = new User({ email, password: hashed })
  await user.save()

  res.status(201).send(pick(user, ['_id', 'email']))
}

export const thirdPartyLogin: RequestHandler = async (req, res) => {
  const { email, name, provider, providerId } = req.body
  console.log('body', req.body)

  let user = await User.findOne({ email })
  if (user) {
    const tokens = await user.login()
    return res.send({
      id: user._id,
      email: user.email,
      access: tokens.access,
    })
  }

  const [firstName, lastName] = name.split(' ')

  user = new User({ email, firstName, lastName, provider, providerId })
  await user.save()

  const tokens = await user.login()

  res.send({
    id: user._id,
    email: user.email,
    access: tokens.access,
  })
}

export const loginUser: ReqHandler = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) throw new BadRequest('Invalid email or password.')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new BadRequest('Invalid email or password.')

  const tokens = await user.login()

  res.send({
    id: user._id,
    email: user.email,
    access: tokens.access,
  })
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

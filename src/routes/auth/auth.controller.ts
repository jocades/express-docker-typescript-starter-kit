import { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { decrypt } from '../../utils/hash'
import { User } from '../../models/user.model'
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

  return res.status(201).send(pick(user, ['_id', 'email']))
}

export const thirdPartyLogin: RequestHandler = async (req, res) => {
  const { email, name, provider, providerId } = req.body
  console.log('body', req.body)

  let user = await User.findOne({ email })
  if (user) {
    const token = user.generateToken()
    return res.json({
      id: user._id,
      email: user.email,
      access: token,
    })
  }

  const [firstName, lastName] = name.split(' ')

  user = new User({ email, firstName, lastName, provider, providerId })
  await user.save()

  const token = user.generateToken()

  return res.json({
    id: user._id,
    email: user.email,
    access: token,
  })
}

export const loginUser: ReqHandler = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) throw new BadRequest('Invalid email or password.')

  const valid = await bcrypt.compare(password, user.password!)
  if (!valid) throw new BadRequest('Invalid email or password.')

  const token = user.generateToken()

  return res.json({
    id: user._id,
    email: user.email,
    access: token,
  })
}

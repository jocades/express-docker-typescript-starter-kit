import { Response, Router } from 'express'
import bcrypt from 'bcrypt'
import User, { validate } from '../models/user'
import _ from 'lodash'
import jwt from 'jsonwebtoken'

const router = Router()

const sendMsg = (res: Response, message: string) => res.status(400).send({ message })

router.post('/register', async (req, res) => {
  const { email, password } = req.body as Credentials

  const { error } = validate(email, password)
  if (error) return sendMsg(res, error.details[0].message)

  let user = await User.findOne({ email })
  if (user) return sendMsg(res, 'User already registered.')

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)

  user = new User({ email, password: hashed })
  await user.save()

  res.send(_.pick(user, ['_id', 'email']))
})

router.post('/', async (req, res) => {
  const { email, password } = req.body as Credentials

  const { error } = validate(email, password)
  if (error) return sendMsg(res, error.details[0].message)

  const user = await User.findOne({ email })
  if (!user) return sendMsg(res, 'Invalid email or password.')

  const v = await bcrypt.compare(password, user.password)
  if (!v) return sendMsg(res, 'Invalid email or password.')

  const tokens = await user.login()
  res.send(tokens)
})

router.post('/logout', async (req, res) => {
  const { refresh } = req.body as Tokens
  try {
    const decoded = jwt.verify(refresh, 'jwtRKey') as UserPayload

    const user = await User.findById(decoded._id)
    if (!user) return res.status(400).send('Bad request.')
    await user.logout(refresh)

    res.send('Logged out.')
  } catch (err: any) {
    res.status(403).send(err.message)
  }
})

router.post('/refresh', async (req, res) => {
  const { refresh } = req.body as Tokens

  jwt.verify(refresh, 'jwtRKey', async (err: any, decoded: any) => {
    if (err) return res.status(403).send(err.message)

    const user = await User.findById(decoded._id)
    if (!user) return res.status(403).send('Access denied.')

    user.refresh(refresh, (err, tokens) => {
      if (err) return res.status(403).send(err.message)

      res.send(tokens)
    })
  })
})

export default router

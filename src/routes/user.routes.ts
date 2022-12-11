import { Router } from 'express'
import { auth } from '../middleware'
import { User, Group } from '../models'
import _ from 'lodash'

const router = Router()

router.get('/', async (_, res) => {
  const users = await User.find()
  res.send(users)
})

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.put('/me', auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body)
  res.send({ ...req.body, _id: user?._id })
})

router.get('/me/groups', auth, async (req, res) => {
  const groups = await Group.find({ members: req.user._id })
  res.send(groups)
})

export default router

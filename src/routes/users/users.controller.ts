import { RequestHandler } from 'express'
import { User } from '../../models/user.model'
import { response } from '../../lib/controller-factory'
import { NotFound } from '../../lib/errors'

export const getUser: RequestHandler = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('friends', '_id firstName lastName')
  return response(res, user)
}

export const updateUser: RequestHandler = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body)
  return response(res, user, { ...req.body, _id: user?._id })
}

export const deleteUser: RequestHandler = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id)
  if (!user) throw new NotFound('User not found')

  return res.sendStatus(204)
}

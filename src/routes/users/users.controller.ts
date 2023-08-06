import { RequestHandler } from 'express'
import User from '../../models/user.model'
import { notFound, response } from '../../lib/controller-factory'

export const getUser: RequestHandler = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -auth')
  response(res, user)
}

export const updateUser: RequestHandler = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body)
  response(res, user, { ...req.body, _id: user?._id })
}

export const deleteUser: RequestHandler = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id)
  if (!user) return notFound(res, 'user')

  res.sendStatus(204)
}

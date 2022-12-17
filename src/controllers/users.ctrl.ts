import { RequestHandler } from 'express'
import User from '../models/user'
import { notFound, response } from './req-handlers'

export const getUser: RequestHandler = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -auth')
  return response(res, user)
}

export const updateUser: RequestHandler = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body)
  return response(res, user, { ...req.body, _id: user?._id })
}

export const deleteUser: RequestHandler = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id)
  if (!user) return notFound(res, 'user')

  res.sendStatus(204)
}

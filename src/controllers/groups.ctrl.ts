import { Request, Response } from 'express'
import Group from '../models/group'
import { notFound } from './req-handlers'

export const joinGroup = async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res, 'group')

  await group.addMember(req.user._id)

  res.send({ message: `Joined group ${group.name}` })
}

export const leaveGroup = async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res, 'group')

  await group.removeMember(req.user._id)

  res.send({ message: `Left group ${group.name}` })
}

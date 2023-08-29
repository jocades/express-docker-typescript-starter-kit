import { RequestHandler } from 'express'
import Group from '../../models/group.model'
import { notFound } from '../../lib/controller-factory'

export const listGroups: RequestHandler = async (req, res) => {
  const { lat, long, maxDistance, order } = req.query

  if (lat && long) {
    const groups = await Group.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [long, lat],
          },
          $maxDistance: maxDistance || 100000, // in meters
        },
      },
    })
    return res.json(groups)
  }

  if (order) {
    if (order === 'created') {
      const groups = await Group.find().sort({ createdAt: -1 })
      return res.json(groups)
    }

    if (order === 'updated') {
      const groups = await Group.find().sort({ updatedAt: -1 })
      return res.json(groups)
    }
  }

  const groups = await Group.find().select('-location')
  return res.json(groups)
}

export const listGroupsByUser: RequestHandler = async (req, res) => {
  if (req.query.order === 'updated') {
    const groups = await Group.find({ members: req.user._id }).sort({
      updatedAt: -1,
    })
    return res.json(groups)
  }

  const groups = await Group.find({ members: req.user._id })
  return res.json(groups)
}

export const createGroup: RequestHandler = async (req, res) => {
  const location = req.body.location
    ? { type: 'Point', coordinates: req.body.location }
    : undefined

  const group = new Group({ ...req.body, location, members: [req.user._id] })
  await group.save()

  return res.json(group)
}

export const joinGroup: RequestHandler = async (req, res) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res, 'group')

  const msg = await group.addMember(req.user._id)

  return res.json({ msg })
}

export const leaveGroup: RequestHandler = async (req, res) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res, 'group')

  const msg = await group.removeMember(req.user._id)

  return res.json({ msg })
}

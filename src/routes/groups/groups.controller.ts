import { RequestHandler } from 'express'
import { z } from 'zod'
import Group from '../../models/group.model'
import { notFound } from '../../lib/controller-factory'
import { parseQuery } from '../../middleware'

const coord = z
  .string()
  .regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/)
  .transform(Number)

const querySchema = z
  .object({
    lat: coord,
    long: coord,
    maxDistance: z.string().regex(/^\d+$/).transform(Number),
    order: z.enum(['created', 'updated']),
  })
  .partial()

export const listGroups: RequestHandler[] = [
  parseQuery(querySchema),
  async (req, res) => {
    const { lat, long, maxDistance, order } = req.query

    console.log(req.query)

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
      return res.send(groups)
    }

    if (order) {
      if (order === 'created') {
        const groups = await Group.find().sort({ createdAt: -1 })
        return res.send(groups)
      }

      if (order === 'updated') {
        const groups = await Group.find().sort({ updatedAt: -1 })
        return res.send(groups)
      }
    }

    const groups = await Group.find().select('-location')
    res.send(groups)
  },
]

export const listGroupsByUser: RequestHandler = async (req, res) => {
  if (req.query.order === 'updated') {
    const groups = await Group.find({ members: req.user._id }).sort({
      updatedAt: -1,
    })
    return res.send(groups)
  }

  const groups = await Group.find({ members: req.user._id })
  res.send(groups)
}

export const createGroup: RequestHandler = async (req, res) => {
  const location = req.body.location
    ? { type: 'Point', coordinates: req.body.location }
    : undefined

  const group = new Group({ ...req.body, location, members: [req.user._id] })
  await group.save()

  res.send(group)
}

export const joinGroup: RequestHandler = async (req, res) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res, 'group')

  const message = await group.addMember(req.user._id)

  res.send({ message })
}

export const leaveGroup: RequestHandler = async (req, res) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res, 'group')

  const message = await group.removeMember(req.user._id)

  res.send({ message })
}

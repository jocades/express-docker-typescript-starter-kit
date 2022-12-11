import _ from 'lodash'
import { Request, Response, Router } from 'express'
import Group, { validate } from '../models/group'
import { auth, v, vId } from '../middleware'

const router = Router()

const notFound = (res: Response) => res.status(404).send('Group not found.')

router.get('/', async (_, res) => {
  const groups = await Group.find()
  res.send(groups)
})

router.post('/', v(validate), async (req, res) => {
  const group = new Group(req.body)
  await group.save()

  res.send(group)
})

router.get('/:id', vId, async (req, res) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res)

  res.send(group)
})

router.put('/:id', [vId, v(validate)], async (req: Request, res: Response) => {
  const { id } = req.params
  const group = await Group.findByIdAndUpdate(id, req.body, { new: true })
  if (!group) return notFound(res)

  res.send({ ...req.body, _id: group._id })
})

router.delete('/:id', vId, async (req, res) => {
  const group = await Group.findByIdAndDelete(req.params.id)
  if (!group) return notFound(res)

  res.sendStatus(204)
})

router.put('/:id/join', [vId, auth], async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res)
  await group.addMember(req.user._id)
  res.send({ message: `Joined group ${group.name}` })
})

router.put('/:id/leave', [vId, auth], async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id)
  if (!group) return notFound(res)
  await group.removeMember(req.user._id)
  res.send({ message: `Left group ${group.name}` })
})

export default router

// # comments
// when using an array of mw, the req and res objects don't inherit the types
// this might be a bug in express or ts or both or neither but it's annoying

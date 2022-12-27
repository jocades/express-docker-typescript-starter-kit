import { Router } from 'express'
import Group, { validateGroup } from '../models/group'
import { auth, v, vId } from '../middleware'
import handler from '../controllers/factory'
import { joinGroup, leaveGroup, listGroups, createGroup } from '../controllers/groups.ctrl'

const router = Router()

router.route('/')
  .get(listGroups)
  .post(v(validateGroup), createGroup)

router.route('/:id')
  .get(vId, handler.getOne(Group))
  .put([vId, v(validateGroup)], handler.updateOne(Group))
  .delete(vId, handler.deleteOne(Group))

router.put('/:id/join', [vId, auth], joinGroup)
router.put('/:id/leave', [vId, auth], leaveGroup)

export default router

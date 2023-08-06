import { Router } from 'express'
import Group, { groupBody } from '../models/group.model'
import { auth, validate, validateId } from '../middleware'
import handler from '../controllers/factory'
import {
  joinGroup,
  leaveGroup,
  listGroups,
  createGroup,
} from '../controllers/groups.ctrl'

const router = Router()

router.get('/', listGroups)
router.post('/', validate(groupBody), createGroup)

router
  .route('/:id')
  .get(validateId, handler.getOne(Group))
  .put([validateId, validate(groupBody)], handler.updateOne(Group))
  .delete(validateId, handler.deleteOne(Group))

router.put('/:id/join', [validateId, auth], joinGroup)
router.put('/:id/leave', [validateId, auth], leaveGroup)

export default router

import { app } from '../framework/app'

app.route('/groups', {
  list: listGroups,
  post: createGroup,
  get: handler.getOne(Group),
  put: handler.updateOne(Group),
  delete: handler.deleteOne(Group),
})

import { Router } from 'express'
import { validateId, validate } from '../middleware'
import Contact, { contactBody } from '../models/contact.model'
import handler from '../lib/controller-factory'

const router = Router()

router.get('/', handler.list(Contact))
router.post('/', validate(contactBody), handler.createOne(Contact))
router.get('/:id', validateId, handler.getOne(Contact))
router.put(
  '/:id',
  [validateId, validate(contactBody)],
  handler.updateOne(Contact)
)
router.delete(
  '/:id',
  [validateId, validate(contactBody)],
  handler.deleteOne(Contact)
)

export default router

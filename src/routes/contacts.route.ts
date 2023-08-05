import { Router } from 'express'
import { listContacts, createContact, getContact, updateContact, deleteContact } from '../controllers/contacts.ctrl'

const router = Router()
router.get('/', listContacts)
router.post('/', createContact)
router.get('/:id', getContact)
router.put('/:id', updateContact)
router.delete('/:id', deleteContact)

export default router

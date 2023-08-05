import { Router } from 'express'
import User from '../models/user.model'
import { auth, admin } from '../middleware'
import handler from '../controllers/factory'
import { getUser, updateUser, deleteUser } from '../controllers/users.ctrl'

const router = Router()

router.get('/', [auth, admin], handler.list(User))

router
  .route('/me')
  .get(auth, getUser)
  .put(auth, updateUser)
  .delete(auth, deleteUser)

export default router

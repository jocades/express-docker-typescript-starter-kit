import { Router } from 'express'
import { registerUser, loginUser, logoutUser, refreshUser } from '../controllers/auth.ctrl'

const router = Router()

router.post('/', loginUser)
router.post('/register', registerUser)
router.post('/logout', logoutUser)
router.post('/refresh', refreshUser)

export default router

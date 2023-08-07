import { app } from '../../framework/app'
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
} from './auth.controller'

app.useRouter('/auth', (router) => {
  router.post('/', loginUser)
  router.post('/register', registerUser)
  router.post('/logout', logoutUser)
  router.post('/refresh', refreshUser)
  return router
})

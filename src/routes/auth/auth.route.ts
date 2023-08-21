import { app } from '../../framework'
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
  thirdPartyLogin,
} from './auth.controller'

app.useRouter('/auth', (router) => {
  router.post('/login', loginUser)
  router.post('/login/third-party', thirdPartyLogin)
  router.post('/register', registerUser)
  router.post('/logout', logoutUser)
  router.post('/refresh', refreshUser)
  return router
})

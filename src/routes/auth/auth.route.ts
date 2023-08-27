import { app } from '../../framework'
import { validate } from '../../middleware'
import { credentials } from './auth.defs'
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
  thirdPartyLogin,
} from './auth.controller'

app.useRouter(
  '/auth',
  (r) => {
    r.post('/login', validate(credentials), loginUser)
    r.post('/login/third-party', thirdPartyLogin)
    r.post('/register', validate(credentials), registerUser)
    r.post('/logout', logoutUser)
    r.post('/refresh', refreshUser)
    return r
  },
  {
    docs: {
      tags: ['Auth'],
      body: credentials,
    },
  }
)

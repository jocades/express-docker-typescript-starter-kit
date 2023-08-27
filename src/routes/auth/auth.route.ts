import { z } from 'zod'
import { app } from '../../framework'
import { validate } from '../../middleware'
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
  thirdPartyLogin,
} from './auth.controller'

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

app.useRouter('/auth', (r) => {
  r.post('/login', validate(credentials), loginUser)
  r.post('/login/third-party', thirdPartyLogin)
  r.post('/register', validate(credentials), registerUser)
  r.post('/logout', logoutUser)
  r.post('/refresh', refreshUser)
  return r
})

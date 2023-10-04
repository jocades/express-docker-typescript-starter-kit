import { ajo } from '../../ajo'
import { validate } from '../../middleware'
import { credentials } from './auth.defs'
import { registerUser, loginUser, thirdPartyLogin } from './auth.controller'

ajo.useRouter(
  '/auth',
  (r) => {
    r.post('/login', validate(credentials), loginUser)
    r.post('/login/third-party', thirdPartyLogin)
    r.post('/register', validate(credentials), registerUser)
  },
  {
    docs: {
      tags: ['Auth'],
      body: credentials,
    },
  }
)

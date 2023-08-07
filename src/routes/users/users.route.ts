import { app } from '../../framework/app'
import { auth, admin } from '../../middleware'
import { getUser, updateUser, deleteUser } from './users.controller'
import User from '../../models/user.model'

app.route(
  '/users',
  {
    model: User,
    middleware: [auth, admin],
  },
  {},
  {
    '/me': {
      middleware: [auth],
      get: getUser,
      put: updateUser,
    },
  }
)

import { app } from '../../framework'
import Group, { groupBody } from '../../models/group.model'
import { auth, validateId } from '../../middleware'
import {
  joinGroup,
  leaveGroup,
  listGroups,
  createGroup,
  listGroupsByUser,
} from './groups.controller'

app.route(
  '/groups',
  {
    model: Group,
    validator: groupBody,
  },
  {
    list: listGroups,
    create: [auth, createGroup],
  },
  {
    '/me': {
      middleware: [auth],
      get: listGroupsByUser,
    },
    '/:id/join': {
      middleware: [validateId, auth],
      put: joinGroup,
    },
    '/:id/leave': {
      middleware: [validateId, auth],
      put: leaveGroup,
    },
  }
)

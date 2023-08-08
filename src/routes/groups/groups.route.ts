import { app } from '../../framework/app'
import Group, { groupBody } from '../../models/group.model'
import { auth, validateId } from '../../middleware'
import {
  joinGroup,
  leaveGroup,
  listGroups,
  createGroup,
} from './groups.controller'

app.route(
  '/groups',
  {
    model: Group,
    validator: groupBody,
  },
  {
    list: listGroups,
    create: createGroup,
  },
  {
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

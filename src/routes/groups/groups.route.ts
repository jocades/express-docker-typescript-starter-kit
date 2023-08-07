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
    createOne: createGroup,
  },
  {
    '/:id/join': {
      put: joinGroup,
      middleware: [validateId, auth],
    },
    '/:id/leave': {
      put: leaveGroup,
      middleware: [validateId, auth],
    },
  }
)

import { app } from '@/framework'
import { Group, groupDto } from '@/models/group.model'
import { auth, parseQuery, validateId } from '../../middleware'
import {
  joinGroup,
  leaveGroup,
  listGroups,
  createGroup,
  listGroupsByUser,
} from './groups.controller'
import { listGroupsQuery } from './groups.defs'

app.route(
  '/groups',
  {
    model: Group,
    validator: groupDto,
    docs: { tags: ['Groups'] },
  },
  {
    list: [parseQuery(listGroupsQuery), listGroups],
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

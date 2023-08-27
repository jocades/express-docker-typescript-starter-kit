import { app } from '../../framework'
import { auth, admin } from '../../middleware'
import { getUser, updateUser, deleteUser } from './users.controller'
import User from '../../models/user.model'
import { BadRequest } from '../../lib/errors'

app.route(
  '/users',
  {
    model: User,
    middleware: [auth, admin],
    docs: { tags: ['Users'] },
  },
  {},
  {
    '/me': {
      middleware: [auth],
      get: getUser,
      put: updateUser,
      delete: deleteUser,
    },
    '/add': {
      middleware: [auth],
      post: async (req, res) => {
        const user = (await User.findById(req.user._id))!
        const recipient = await User.findById(req.body.recipientId)
        if (!recipient) throw new BadRequest('Invalid recipient ID.')

        if (user.friends.includes(req.body.recipientId)) {
          throw new BadRequest('Friend already added.')
        }

        await user.updateOne({ $push: { friends: recipient._id } })
        await recipient.updateOne({ $push: { friends: user._id } })

        res.json({ message: 'Friend added.' })
      },
    },
  }
)

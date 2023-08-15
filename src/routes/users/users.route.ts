import { app } from '../../framework/app'
import { auth, admin } from '../../middleware'
import { getUser, updateUser, deleteUser } from './users.controller'
import User from '../../models/user.model'
import { BadRequest } from '../../lib/errors'

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
      delete: deleteUser,
    },
    '/add': {
      middleware: [auth],
      post: async (req, res) => {
        const user = (await User.findById(req.user._id))!
        const recipient = await User.findById(req.body.recipientId)
        if (!recipient) throw new BadRequest('Invalid recipient ID.')

        if (user.friends.includes(req.body.recipientId)) {
          return res.status(400).json({ message: 'Friend already added.' })
        }

        await user.updateOne({ $push: { friends: recipient._id } })
        await recipient.updateOne({ $push: { friends: user._id } })

        res.json({ message: 'Friend added.' })
      },
    },
  }
)

import { app } from '../../framework/app'
import { auth } from '../../middleware'
import Game from '../../models/game.model'

const reducedUser = '_id firstName lastName email'

app.route(
  '/games',
  {
    // middleware: [auth],
    model: Game,
  },
  {},
  {
    '/me': {
      middleware: [auth],
      get: async (req, res) => {
        // get the game, add a opponent field based on the current user from the request
        const games = await Game.find({
          $or: [{ white: req.user._id }, { black: req.user._id }],
        })
          .populate('white', reducedUser)
          .populate('black', reducedUser)
          .lean()

        res.json(games)
      },
    },
  }
)

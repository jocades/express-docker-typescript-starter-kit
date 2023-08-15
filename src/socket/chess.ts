import { Socket, SocketServer } from '.'
import { randomUUID } from 'crypto'
import Game, { IGame } from '../models/game.model'
import { Chess } from 'chess.js'

const user = (id: string) => `user:${id}`
const chessRoom = (id: string) => `chess:room:${id}`

interface ActiveGame extends IGame {
  engine: Chess
}

const games = new Map<string, ActiveGame>()

export function chessSocketEvents(io: SocketServer, socket: Socket) {
  socket.on('chess:invite', ({ recipientId, senderColor }, res) => {
    io.to(user(recipientId)).emit('chess:invite', {
      senderId: socket.data.user._id,
      senderColor,
    })
    res?.({ ok: true })
  })

  socket.on('chess:join', async ({ senderId }, res) => {
    const room = randomUUID()

    socket.join(chessRoom(room))
    io.in(user(senderId)).socketsJoin(chessRoom(room))

    games.set(room, {
      engine: new Chess(),
      white: senderId,
      black: socket.data.user._id,
    })

    res?.({ ok: true })

    io.to(chessRoom(room)).emit('chess:join', { room })
  })

  socket.on('chess:move', ({ room, move }, res) => {
    socket.to(chessRoom(room)).emit('chess:move', move)
    games.get(room)?.engine.move(move)
    console.log(games.get(room)?.engine.ascii())
    res?.({ ok: true })
  })

  socket.on('chess:resign', async ({ room }, res) => {
    const activeGame = games.get(room)!
    const winner = activeGame.white === socket.data.user._id ? 'black' : 'white'
    const game = new Game({
      white: activeGame.white,
      black: activeGame.black,
      winner,
      fen: activeGame.engine.fen(),
      pgn: activeGame.engine.pgn(),
      status: 'finished',
      endReason: 'resign',
    })
    await game.save()

    res?.({ ok: true })
    io.to(chessRoom(room)).emit('chess:resign', { room, winner })
  })
}

import { EndReason, Socket, SocketServer } from '.'
import { randomUUID } from 'crypto'
import Game, { IGame } from '../models/game.model'
import { Chess } from 'chess.js'

const user = (id: string) => `user:${id}`
const userId = (socket: Socket) => socket.data.user._id
const chessRoom = (id: string) => `chess:room:${id}`

interface ActiveGame extends IGame {
  engine: Chess
  moves: { san: string; stamp: number; time?: number }[]
}

const games = new Map<string, ActiveGame>()

function checkState(engine: Chess): EndReason | undefined {
  if (engine.isGameOver()) {
    if (engine.isCheckmate()) return 'checkmate'
    else if (engine.isDraw()) return 'draw'
    else if (engine.isStalemate()) return 'stalemate'
    else if (engine.isThreefoldRepetition()) return 'threefoldRepetition'
    else if (engine.isInsufficientMaterial()) return 'insufficientMaterial'
  }
}

export function chessSocketEvents(io: SocketServer, socket: Socket) {
  socket.on('chess:invite', ({ recipientId, senderColor }, res) => {
    res?.({ ok: true })
    io.to(user(recipientId)).emit('chess:invite', {
      senderId: userId(socket),
      senderColor,
    })
  })

  socket.on('chess:join', async ({ senderId, senderColor }, res) => {
    const room = randomUUID()
    const white = senderColor === 'w' ? senderId : userId(socket)
    const black = white === senderId ? userId(socket) : senderId

    socket.join(chessRoom(room))
    io.in(user(senderId)).socketsJoin(chessRoom(room))

    games.set(room, {
      engine: new Chess(),
      moves: [],
      white,
      black,
    })

    res?.({ ok: true, data: { room } })
    io.to(chessRoom(room)).emit('chess:join', { room })
  })

  // handle when one player disconnects (reloads the page or something)
  // make him join the room again
  socket.on('chess:reload', async ({ room }, res) => {
    const roomSize = await io.in(chessRoom(room)).fetchSockets()
    console.log('reloaded', roomSize.length)
    const activeGame = games.get(room)
    if (!activeGame) {
      res?.({ ok: false, data: { message: 'No active game' } })
      return
    }

    socket.join(chessRoom(room))
    // io.in(user(activeGame.white)).socketsJoin(chessRoom(room))

    res?.({
      ok: true,
      data: {
        fen: activeGame.engine.fen(),
        pgn: activeGame.engine.pgn(),
      },
    })

    const rs = await io.in(chessRoom(room)).fetchSockets()
    console.log('reloaded', rs.length)
  })

  socket.on('chess:move', async ({ room, move }, res) => {
    const roomSize = await io.in(chessRoom(room)).fetchSockets()
    console.log('room size', roomSize.length)
    const { engine, moves } = games.get(room)!
    const madeMove = engine.move(move)

    const stamp = Date.now()
    let time = 0
    if (moves.length) time = stamp - moves[moves.length - 1].stamp

    moves.push({ san: madeMove.san, stamp: Date.now(), time })
    console.log(moves)

    const state = checkState(engine)
    if (state) {
      io.to(chessRoom(room)).emit('chess:gameover', { room, state })
      const activeGame = games.get(room)!
      const winner =
        state === 'checkmate'
          ? engine.turn() === 'w'
            ? 'black'
            : 'white'
          : 'draw'

      const game = new Game({
        white: activeGame.white,
        black: activeGame.black,
        winner,
        fen: engine.fen(),
        pgn: engine.pgn(),
        status: 'finished',
        endReason: state,
        moves: activeGame.moves,
      })
      await game.save()
      games.delete(room)
      console.log('active games', games.size)
      res?.({ ok: true })
      return
    }

    res?.({ ok: true })
    socket.to(chessRoom(room)).emit('chess:move', move)
    console.log('active games', games.size)
  })

  socket.on('chess:resign', async ({ room }, res) => {
    const activeGame = games.get(room)!
    const winner = activeGame.white === userId(socket) ? 'black' : 'white'
    const game = new Game({
      white: activeGame.white,
      black: activeGame.black,
      winner,
      fen: activeGame.engine.fen(),
      pgn: activeGame.engine.pgn(),
      status: 'finished',
      endReason: 'resign',
      moves: activeGame.moves,
    })
    await game.save()
    games.delete(room)

    // log the number of active games
    console.log(games.size)

    res?.({ ok: true })
    io.to(chessRoom(room)).emit('chess:resign', { room, winner })
  })
}

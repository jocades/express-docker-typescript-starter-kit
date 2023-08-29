import { type Server } from 'http'
import jwt from 'jsonwebtoken'

import logger from '../logger'
import { SocketServer } from '.'

export function initializeSocket(server: Server) {
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', async (socket) => {
    const token: string = socket.handshake.auth.token
    if (!token) return socket.disconnect()

    jwt.verify(token, process.env.JWT_A_SECRET!, async (err, decoded) => {
      if (err) {
        console.log('Socket auth error', err)
        return socket.disconnect()
      }

      socket.data.user = decoded as UserPayload
      socket.join(`user:${socket.data.user._id}`)

      logger.warn(`Client ${socket.data.user._id} connected.`)
      logger.info(`There are ${io.engine.clientsCount} clients connected.`)
    })

    socket.on('disconnect', async (reason) => {
      logger.warn(`Client ${socket.data.user._id} disconnected. ${reason}`)
      logger.info(`There are ${io.engine.clientsCount} clients connected.`)
    })

    socket.on('ping', (_, res) => {
      res({ ok: true, data: { msg: 'pong!' } })
      socket.emit('pong', { msg: 'pong!' })
    })
  })

  return io
}

import { type Server } from 'http'
import jwt from 'jsonwebtoken'

import logger from '../logger'
import { SocketServer } from '.'
import Group from '../models/group.model'

export function initializeSocket(server: Server) {
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', async (socket) => {
    const token: string = socket.handshake.auth.token
    if (!token) return socket.disconnect()

    jwt.verify(token, process.env.JWT_A_SECRET!, (err, decoded) => {
      if (err) {
        console.log('Socket auth error', err)
        return socket.disconnect()
      }
      socket.data.user = decoded as UserPayload
      logger.warn(`Client ${socket.data.user._id} connected.`)
      logger.info(`There are ${io.engine.clientsCount} clients connected.`)
    })

    socket.on('disconnect', (reason) => {
      logger.warn(`Client ${socket.data.user._id} disconnected. ${reason}`)
      logger.info(`There are ${io.engine.clientsCount} clients connected.`)
    })

    socket.on('ping', (_, res) => {
      res({ ok: true, data: { message: 'pong!' } })
      socket.emit('pong', { message: 'pong!' })
    })

    const groups = await Group.find({ members: socket.data.user._id })
    console.log('user groups', groups.length)
    // groups.forEach((group) => socket.join(`group:${group._id}`))
  })

  return io
}

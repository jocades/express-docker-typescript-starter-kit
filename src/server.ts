import './app/env'
import './app/config'
import http from 'http'
import db from './app/db'
import app from './app'
import logger from './logger'
import { initializeSocket } from './socket/setup'
import { mongoDBListener } from './socket/mongo-listener'

const server = http.createServer(app)
const PORT = process.env.PORT || 8000

db.safeConnect().then(() => {
  server.listen(PORT, () => {
    const io = initializeSocket(server)
    mongoDBListener(io)

    logger.info(` Listening on http://localhost:${PORT}`)
  })
})

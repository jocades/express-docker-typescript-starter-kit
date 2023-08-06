import './start/env'
import './start/config'
import http from 'http'
import db from './start/db'
// import app from './start/app'
import { app } from './framework/app'
import logger from './logger'
import { initializeSocket } from './socket/setup'
import { mongoDBListener } from './socket/mongo-listener'

const server = http.createServer(app.init())
const PORT = process.env.PORT || 8000

server.listen(PORT, () => {
  logger.info(` Listening on http://localhost:${PORT}`)
})

// db.safeConnect().then(() => {
//   server.listen(PORT, () => {
//     const io = initializeSocket(server)
//     mongoDBListener(io)

//     logger.info(` Listening on http://localhost:${PORT}`)
//   })
// })

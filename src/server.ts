import '@/config/env'
import './config/events'
import db from './config/database'
import http from 'http'
import logger from './logger'
import { initializeSocket } from './socket/setup'
import { mongoDBListener } from './socket/mongo-listener'
import { ajo } from './ajo'

ajo.init().then((app) => {
  const server = http.createServer(app)
  const PORT = process.env.PORT || 8000

  db.safeConnect().then(() => {
    server.listen(PORT, () => {
      const io = initializeSocket(server)
      mongoDBListener(io)

      logger.info(` Listening on http://localhost:${PORT}`)
    })
  })
})

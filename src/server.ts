import './start/env'
import './start/config'
import db from './start/db'
import app from './start/app'
import logger from './logger'

const PORT = process.env.PORT || 8000

db.safeConnect().then(() => {
  app.listen(PORT, () => {
    logger.info(`﬉ Listening on http://localhost:${PORT}`)
  })
})

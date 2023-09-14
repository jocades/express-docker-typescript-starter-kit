import { connect, set, connection } from 'mongoose'
import logger from '../logger'
import { config } from './consts'

const connectDB = async () => {
  try {
    set('strictQuery', false)
    const db = await connect(config.dbURL, { dbName: config.dbName })
    logger.info(` Connected to MongoDB/${db.connection.name}`)
  } catch (err) {
    logger.error('Failed connecting to MongoDB', err)
    process.exit(1)
  }
}

const safeConnect = async () => {
  if (process.env.NODE_ENV?.includes('prod') && !process.env.DB_URL)
    logger.error('DB_URL not specified in environment') && process.exit(1)
  else if (!process.env.DB_URL) {
    logger.warn('DB_URL not specified in environment, using default')
  }
  await connectDB()
}

const disconnectDB = () => connection.close()

export default {
  connect: connectDB,
  close: disconnectDB,
  safeConnect,
}

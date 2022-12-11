import { connect } from 'mongoose'
import { log } from '../utils/debug'

const dbName = process.env.NODE_ENV === 'test' ? 'express-ts-test' : 'express-ts'

const connectDB = async () => {
  try {
    const db = await connect(`mongodb://localhost:27017/${dbName}`)
    log(`Connection to mongoDB/${db.connection.name} established`)
  } catch (err) {
    log('Connection to mongoDB failed', err)
  }
}

connectDB()

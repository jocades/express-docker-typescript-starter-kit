import { MongoClient } from 'mongodb'
import { type SocketServer } from '.'
import logger from '../logger'

const MONGODB_URI = 'mongodb://localhost:27017'

export async function mongoDBListener(io: SocketServer) {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    logger.info('MongoDB listener connected')

    const db = client.db('express-ts')

    const groupsStream = db
      .collection('groups')
      .watch([], { fullDocument: 'updateLookup' })

    groupsStream.on('change', (change) => {
      io.emit('groups:change', change)
    })
  } catch (err) {
    console.log(err)
  }
}

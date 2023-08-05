import { MongoClient } from 'mongodb'
import { type SocketServer } from '.'
import logger from '../logger'

const MONGODB_URI = 'mongodb://localhost:27017'
const COLLECTION_NAME = 'groups'

export async function mongoDBListener(io: SocketServer) {
  const client = new MongoClient(MONGODB_URI)

  try {
    client.connect()
    logger.info('MongoDB listener connected')

    const groups = client.db('express-ts').collection(COLLECTION_NAME)
    const changeStream = groups.watch([], { fullDocument: 'updateLookup' })

    changeStream.on('change', (change) => {
      // console.log('Change occured in DB:', change)
      io.emit('groups:change', change)
    })
  } catch (err) {
    console.log(err)
  } finally {
    // await client.close()
    // console.log('MongoDB listener disconnected')
  }
}

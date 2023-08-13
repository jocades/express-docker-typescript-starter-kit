import { Db, Document, MongoClient } from 'mongodb'
import { type SocketServer } from '.'
import logger from '../logger'
import Group, { IGroup } from '../models/group.model'

const MONGODB_URI = 'mongodb://localhost:27017'

export async function mongoDBListener(io: SocketServer) {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    logger.info('MongoDB listener connected')

    const db = client.db('express-ts')

    groupsListener(db, io)
  } catch (err) {
    console.log(err)
  }
}

export function groupsListener(db: Db, io: SocketServer) {
  const groupsStream = db.collection<IGroup>('groups').watch([], {
    fullDocument: 'updateLookup',
    fullDocumentBeforeChange: 'whenAvailable',
  })

  groupsStream.on('change', async (change) => {
    console.log(change)

    let group: IGroup | null = null

    if (change.operationType === 'insert' || change.operationType === 'update')
      group = change.fullDocument!
    else if (change.operationType === 'delete')
      group = change.fullDocumentBeforeChange!

    if (!group) return

    const sockets = await io.fetchSockets()
    const groupMembers = group.members.map((m) => m.toString())

    for (const socket of sockets) {
      if (groupMembers.includes(socket.data.user._id)) {
        socket.emit('groups:change', change)
      }
    }
  })
}

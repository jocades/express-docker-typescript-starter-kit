import { Db, Document, MongoClient } from 'mongodb'
import { type SocketServer } from '.'
import logger from '../logger'
import { IGroup } from '../models/group.model'
import { DB_NAME, DB_URL } from '../config/consts'

export async function mongoDBListener(io: SocketServer) {
  const client = new MongoClient(DB_URL)

  try {
    await client.connect()
    logger.info('MongoDB listener connected')

    const db = client.db(DB_NAME)

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

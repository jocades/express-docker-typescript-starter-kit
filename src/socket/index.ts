import {
  Server as BaseSocketServer,
  type Socket as BaseSocket,
} from 'socket.io'
import { type DefaultEventsMap } from 'socket.io/dist/typed-events'
import { type ChangeStreamDocument } from 'mongodb'
import { Move } from 'chess.js'

type SocketOkResponse<T> = { ok: true; data?: T }
type SocketErrorResponse = { ok: false; data?: { message: string } }

// prettier-ignore
export type SocketResponse<T = unknown> = (res: SocketOkResponse<T> | SocketErrorResponse) => void

export type Color = 'w' | 'b'
export type EndReason =
  | 'checkmate'
  | 'draw'
  | 'stalemate'
  | 'threefoldRepetition'
  | 'insufficientMaterial'

interface ClientToServerEvents {
  ping: (data: any, res: SocketResponse) => void
}

interface ServerToClientEvents {
  pong: (data: { message: string }) => void
  'groups:change': (data: ChangeStreamDocument) => void
}

interface SocketData {
  user: UserPayload
}

export class SocketServer extends BaseSocketServer<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
> {}

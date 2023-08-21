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

  'chess:invite': (
    data: { recipientId: string; senderColor: Color },
    res?: SocketResponse
  ) => void
  'chess:join': (
    data: { senderId: string; senderColor: Color },
    res?: SocketResponse
  ) => void
  'chess:move': (
    data: { room: string; move: Move },
    res: SocketResponse
  ) => void
  'chess:resign': (data: { room: string }, res?: SocketResponse) => void
  'chess:reload': (
    data: { room: string },
    res: SocketResponse<{ fen: string; pgn: string }>
  ) => void
}

interface ServerToClientEvents {
  pong: (data: { message: string }) => void

  'chess:invite': (data: { senderId: string; senderColor: Color }) => void
  'chess:join': (data: { room: string }) => void
  'chess:move': (data: Move) => void
  'chess:resign': (data: { room: string; winner: string }) => void
  'chess:gameover': (data: { room: string; state: EndReason }) => void

  'groups:change': (data: ChangeStreamDocument) => void
}

interface SocketData {
  user: UserPayload
}

export type Socket = BaseSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>

export class SocketServer extends BaseSocketServer<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
> {}

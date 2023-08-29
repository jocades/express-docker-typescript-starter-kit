import {
  Server as BaseSocketServer,
  type Socket as BaseSocket,
  type RemoteSocket as BaseRemoteSocket,
} from 'socket.io'
import { type DefaultEventsMap } from 'socket.io/dist/typed-events'
import { type ChangeStreamDocument } from 'mongodb'

type SocketOkResponse<T> = { ok: true; data?: T }
type SocketErrorResponse = { ok: false; data?: { msg: string } }

// prettier-ignore
export type SocketResponse<T = unknown> = (res: SocketOkResponse<T> | SocketErrorResponse) => void

export interface ClientToServerEvents {
  ping: (data: any, res: SocketResponse) => void
}

export interface ServerToClientEvents {
  pong: (data: { msg: string }) => void
  'groups:change': (data: ChangeStreamDocument) => void
}

export interface SocketData {
  user: UserPayload
}

export type Socket = BaseSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>

export type RemoteSocket = BaseRemoteSocket<ServerToClientEvents, SocketData>

export class SocketServer extends BaseSocketServer<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
> {}

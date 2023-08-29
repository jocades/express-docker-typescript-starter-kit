import { type Socket, type RemoteSocket } from '.'

export function userId(socket: Socket | RemoteSocket) {
  return socket.data.user._id
}

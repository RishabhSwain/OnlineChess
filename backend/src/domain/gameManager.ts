import { Socket, Server } from "socket.io"
import { Chess } from "chess.js"

const games = new Map<string, Chess>()

export function createGame(socket: Socket): string {
  const gameId = crypto.randomUUID()
  games.set(gameId, new Chess())
  socket.join(gameId)
  return gameId
}

export function joinGame(socket: Socket, gameId: string): boolean {
  if (!games.has(gameId)) return false
  socket.join(gameId)
  return true
}

export function handleMove(
  io: Server,
  socket: Socket,
  gameId: string,
  move: any
) {
  const game = games.get(gameId)
  if (!game) return

  const result = game.move(move)
  if (!result) {
    socket.emit("invalid-move")
    return
  }

  io.to(gameId).emit("game-state", {
    fen: game.fen(),
    lastMove: result
  })
}

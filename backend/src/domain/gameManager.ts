import { Socket, Server } from "socket.io"
import { Chess } from "chess.js"

export const games = new Map<string, Chess>()

export function createLocalGame(roomCode: string): boolean {
  
  games.set(roomCode, new Chess())
  
  return true
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

  try {
  const result = game.move(move)

  io.to(gameId).emit("game-state", {
    fen: game.fen(),
    lastMove: result
  })
} catch (error) {
  console.error("Error making move:", error)

  socket.emit("invalid-move")
  return
}


  

  
}

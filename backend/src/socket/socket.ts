import { Server, Socket } from "socket.io"
import {  joinGame, handleMove } from "./../domain/gameManager.ts"

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Connected:", socket.id)

    socket.join("global")

    socket.on("join-game", (gameId: string) => {
      const success = joinGame(socket, gameId)
      socket.emit("join-result", success)
    })

    socket.on("move", ({ gameId, move }) => {
      handleMove(io, socket, gameId, move)
    })

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id)
    })
  })
}

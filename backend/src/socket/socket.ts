import { Server, Socket } from "socket.io";
import { joinGame, handleMove } from "./../domain/gameManager.ts";

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Connected:", socket.id);

    socket.join("global");

    socket.on("join-game", async (gameId: string) => {
      const success = joinGame(socket, gameId);

      const room = io.sockets.adapter.rooms.get(gameId);
      const count = room ? room.size : 0;
      
      socket.emit("join-result", success);
      if (count === 2) {
        io.to(gameId).emit("start-game");
      }
    });

    socket.on("move", ({ gameId, move }) => {
      handleMove(io, socket, gameId, move);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
}

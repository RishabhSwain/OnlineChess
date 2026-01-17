import Game from "../models/Game.js";



import { games } from "../domain/gameManager.ts";

import { createLocalGame } from "../domain/gameManager.ts";

// const rooms = {};

export const createRoom = async (req, res) => {
  const { userId } = req.body;
  try {
    let roomCode;
    let game;

    // retry on collision
    while (!game) {
      roomCode = Math.random().toString(36).slice(2, 8);

      try {
        game = await Game.create({
          roomCode,
          finished: false,
          players: [
            {
              userId: userId || "guest1",
              color: "white",
            },
          ],
          state: {
            board: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            turn: "white",
            moveCount: 0,
          },
        });
      } catch (err) {
        if (err.code !== 11000) throw err; // duplicate key
      }
    }

    createLocalGame(roomCode)

    res.status(201).json({ roomId: roomCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create room" });
  }
};

export const checkRoomExists = async (req, res) => {
  const id = req.query.id;

  await Game.findOne({ roomCode: id }).then((game) => {
    if (game) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
};

export const joinRoom = async (req, res) => {
  const body = req.body;
  const { userId, roomId } = body;

  const game = await Game.findOne({ roomCode: roomId });
  if (game) {
    if (game.players.some((p) => p.userId === userId)) {
      return res.json({ message: "User already in the room", success: false });
    } else if (game.players[1] == null) {
      await Game.updateOne(
        { roomCode: roomId },
        {
          $push: {
            players: {
              userId: userId,
              color: "black",
            },
          },
        }
      );
      res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Room is full" });
    }
  } else {
    return res.json({ success: false, message: "Room not found" });
  }
};

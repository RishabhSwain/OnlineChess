import Game from "../models/Game.js";

import { Chess } from "chess.js";

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
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          },
        });
      } catch (err) {
        if (err.code !== 11000) throw err; // duplicate key
      }
    }

    createLocalGame(roomCode);

    res.status(201).json({ roomId: roomCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create room" });
  }
};

export const getState = async (req, res) => {
  const id = req.query.id;

  const game = await Game.findOne({ roomCode: id });
  if (game) {
    res.json({
      players: game.players,
      state: game.state,
      finished: game.finished,
    });
  } else {
    res.status(404).json({ error: "Game not found" });
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
        },
      );
      res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Room is full" });
    }
  } else {
    return res.json({ success: false, message: "Room not found" });
  }
};

export const makeMove = async (req, res) => {
  const { roomId, move } = req.body;
  
  const game = await Game.findOne({ roomCode: roomId });
  if (game) {
    const curGame = new Chess(game.state.fen);

    let result;
    try {
      result = curGame.move(move);
    } catch (err) {
      return res.json({ success: false, message: "Invalid move" });
    }

    if (result) {
      await Game.updateOne(
        { roomCode: roomId },
        {
          $set: { "state.fen": curGame.fen() }
        },
      );
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid move" });
    }
  } else {
    res.status(404).json({ error: "Game not found" });
  }
};

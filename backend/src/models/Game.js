import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    color: { type: String, required: true },
    connected: { type: Boolean, default: true },
  },
  { _id: false }
);

const stateSchema = new mongoose.Schema(
  {
    board: { type: String, required: true },
    turn: { type: String, required: true },
  },
  { _id: false }
);

const gameSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true },
    finished: { type: Boolean, required: true },
    players: { type: [playerSchema], required: true },
    state: { type: stateSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);

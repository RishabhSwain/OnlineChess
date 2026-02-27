import express from "express";
import { createRoom, checkRoomExists, joinRoom, getState, makeMove, deleteRoom, getOpponent} from "../controllers/game.controller.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/create", createRoom);
router.post("/leave", deleteRoom);
router.get("/exists", checkRoomExists);
router.post("/join", joinRoom);
router.get("/state", getState);
router.post("/move", makeMove);
router.post("/opponent", getOpponent);

export default router;

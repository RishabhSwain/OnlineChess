import express from "express";
import { createRoom, checkRoomExists, joinRoom } from "../controllers/game.controller.js";

const router = express.Router();

router.post("/create", createRoom);
router.get("/exists", checkRoomExists);
router.post("/join", joinRoom);

export default router;

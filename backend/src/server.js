import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';

import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket/socket.ts';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://online-chess-phi.vercel.app'],
    credentials: true,
  }
});

setupSocket(io);

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'https://online-chess-phi.vercel.app'],
  credentials: true
}));

app.use(cookieParser());





connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("SocketIO Server running on port", PORT);
})
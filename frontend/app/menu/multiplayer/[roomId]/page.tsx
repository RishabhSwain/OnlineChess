"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";

import {socket} from "@/lib/socket";

import { useGameStore } from "@/store/gameStore";

import ChessboardComponent from "@/components/ChessboardComponent";

interface GameData {
  fen: string;
  turn: "white" | "black";
  state: any;
}

export default function Game() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const params = useParams();
  const roomId = params.roomId;

  const [gameData, setGameData] = useState<GameData | null>(null);

  const fen = useGameStore((s) => s.fen);
  const turn = useGameStore((s) => s.turn);
  const setTurn = useGameStore((s) => s.setTurn);

  useEffect(() => {
    if (fen.split(" ")[1] === "b") {
      setTurn("black");
    } else {
      setTurn("white");
    }
  }, [fen]);


  // redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading]);

  const [roomExists, setRoomExists] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify room exists on page load
    api.get("/game/exists", { params: { id: roomId } })
      .then(res => {
        setRoomExists(res.data.exists);
      })
      .catch(() => setRoomExists(false));

  }, [roomId]);

  useEffect(() => {
    socket.emit("join-game", roomId);
  }, [roomId]);

  useEffect(() => {
    
    if (!gameData){
      api.get<GameData>("/game/state", { params: { id: roomId } }).then(res => {
        const response = res.data;
        setGameData(response);
      });      
    }
    
  }, []);
  

  if (roomExists === null) return <p className="text-white">Loading...</p>;
  if (!roomExists) return <p className="text-red-500">Room not found!</p>;

  if (loading) return null;

  const gameId = roomId?.toString() || "";

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {user?.username}</h1><h1 className="text-2xl font-semibold">Online Chess</h1><h1 className="text-2xl font-semibold">{turn?.toUpperCase()}'s Turn</h1>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-500 hover:cursor-pointer"
        >
          Logout
        </button>
      </div>
      {/* Main */}
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="w-full md:w-1/3">Chat Section</div>
        <div className="w-full md:w-2/3"><div className="m-auto" style={{width:600}}><ChessboardComponent gameId={gameId} gameData={gameData} /></div></div>
      </div>
      
    </div>
  );
}

"use client";

import { use, useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";

import { socket } from "@/lib/socket";

import { useGameStore } from "@/store/gameStore";

import ChessboardComponent from "@/components/ChessboardComponent";
import ChatUI from "@/components/ChatUI";
import { AnimatePresence, motion } from "framer-motion";

import { toast } from 'sonner';

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
  const opponentPresent = useGameStore((s) => s.opponentPresent);
  const setOpponentPresent = useGameStore((s) => s.setOpponentPresent);

  const [opponent, setOpponent] = useState<string | null>(null);

  const copyLink = async () => {
    await navigator.clipboard.writeText(roomId as string);
    toast.success("Code copied!");
  };

  const leaveRoom = async () => {
    
    api.post("/game/leave", { id: roomId });
    router.replace("/menu/multiplayer/lobby");
  };

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
    api
      .get("/game/exists", { params: { id: roomId } })
      .then((res) => {
        setRoomExists(res.data.exists);
      })
      .catch(() => setRoomExists(false));
  }, [roomId]);

  useEffect(() => {
    socket.emit("join-game", roomId);
    
  }, [roomId]);

  useEffect(() => {
    if (!gameData) {
      api
        .get<GameData>("/game/state", { params: { id: roomId } })
        .then((res) => {
          const response = res.data;
          setGameData(response);
        });
    }
  }, []);

  const prevValueRef = useRef(opponentPresent);

  useEffect(() => {
    if (prevValueRef.current === opponentPresent) return;

    // 🔥 Runs ONLY when value actually changes
    // console.log("Opponent changed!", opponentPresent);

    api
      .post("/game/opponent", { roomId: roomId, userId: user?.username })
      .then((res) => {
        setOpponent(res.data.opponent);
      });

    prevValueRef.current = opponentPresent;
  }, [opponentPresent]);


  if (roomExists === null) return <p className="text-white">Loading...</p>;
  if (!roomExists) return <p className="text-red-500">Room not found!</p>;

  if (loading) return null;

  const gameId = roomId?.toString() || "";

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {opponentPresent === false && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#444_25%,transparent_25%,transparent_75%,#444_75%,#444),linear-gradient(45deg,#444_25%,transparent_25%,transparent_75%,#444_75%,#444)] bg-[length:40px_40px] bg-[position:0_0,20px_20px]" />

            <motion.div
              className="relative bg-zinc-900/95 border border-zinc-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-5"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              
              <motion.div
                className="text-5xl"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ♞
              </motion.div>

              <h2 className="text-xl font-semibold tracking-wide">
                Waiting for opponent...
              </h2>

              <p className="text-sm text-zinc-400">
                Share this code to summon your challenger.
              </p>

              <div className="flex gap-2">
                <input
                  value={roomId}
                  readOnly
                  className="flex-1 bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-sm text-zinc-200 focus:outline-none"
                />
                <button
                  onClick={copyLink}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-medium cursor-pointer"
                >
                  Copy
                </button>
              </div>

              <div className="text-xs text-zinc-500 italic">
                Board ready • Clock paused • Awaiting player
              </div>

              <button
                onClick={leaveRoom}
                className="text-red-400 hover:text-red-300 text-sm mt-2 cursor-pointer"
              >
                Leave room
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {user?.username}</h1>
        <h1 className="text-2xl font-semibold">Online Chess</h1>
        <h1 className="text-2xl font-semibold">{turn?.toUpperCase()}'s Turn</h1>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-500 hover:cursor-pointer"
        >
          Logout
        </button>
      </div>
      {/* Main */}
      <div className="container mx-auto flex flex-col md:flex-row">
        
        <div className="w-full md:w-2/3">
          <div className="m-auto w-full lg:w-3/4">
            {/* <ChessboardComponent gameId={gameId} gameData={gameData} /> */}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <ChatUI opponent={opponent ?? ""} self={user?.username ?? ""} />

        </div>
      </div>
    </div>
  );
}

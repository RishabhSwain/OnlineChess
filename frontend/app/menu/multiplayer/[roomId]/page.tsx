"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";

import {socket} from "@/lib/socket";

import ChessboardComponent from "@/components/ChessboardComponent";

type Note = {
  _id: string;
  title: string;
  content: string;
};

export default function Game() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const params = useParams();
  const roomId = params.roomId;

  

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

  if (roomExists === null) return <p className="text-white">Loading...</p>;
  if (!roomExists) return <p className="text-red-500">Room not found!</p>;

  if (loading) return null;

  const gameId = roomId?.toString() || "";

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {user?.username}</h1><h1 className="text-2xl font-semibold">Online Chess</h1>
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
        <div className="w-full md:w-2/3"><div className="m-auto" style={{width:600}}><ChessboardComponent gameId={gameId} /></div></div>
      </div>
      
    </div>
  );
}

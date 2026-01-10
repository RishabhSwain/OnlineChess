"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import api from "@/lib/axios";

import { useAuth } from "@/context/AuthContext"

export default function LobbyPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [roomCode, setRoomCode] = useState("");



  const handleCreateRoom = async () => {
    const res = await api.post("/game/create", {userId: user?.username});
    router.push(`/menu/multiplayer/${res.data.roomId}`);
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;

    const res = await api.post(`/game/join`, { userId: user?.username, roomId: roomCode.trim() });
    


    if (res.data.success) {
      router.push(`/menu/multiplayer/${roomCode.trim()}`);
    } else {
      alert(`${res.data.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <Card className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-center text-zinc-100">
              Lobby
            </h1>

            <Button
              className="w-full rounded-xl bg-white text-black hover:bg-zinc-200"
              size="lg"
              onClick={handleCreateRoom}
            >
              Create Room
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-sm text-zinc-500">OR</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="rounded-xl bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />

              <Button
                variant="secondary"
                className="w-full rounded-xl bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                size="lg"
                onClick={handleJoinRoom}
              >
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

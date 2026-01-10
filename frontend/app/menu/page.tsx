"use client"

import { useEffect } from "react"

import { motion } from "framer-motion"
import { Play, Settings, Trophy, Power, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation";

export default function GameMenuPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) router.replace("/login");
      }, [user, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <Card className="rounded-2xl shadow-2xl bg-zinc-950/80 backdrop-blur border border-zinc-800">
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-white">ONLINE CHESS</h1>
              <h1 className="text-xl  tracking-tight text-white">Welcome, {user?.username}!</h1>
              <p className="text-zinc-400 text-sm">Choose your next move</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <MenuButton onClick={() => router.push("/menu/multiplayer/lobby")} icon={<Play size={20} />} label="Start Game" />
              <MenuButton icon={<Trophy size={20} />} label="Leaderboard" />
              <MenuButton icon={<Settings size={20} />} label="Settings" />
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <Button
                onClick={logout}
                variant="ghost"
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function MenuButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Button
        onClick={onClick}
        className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center gap-2"
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </Button>
    </motion.div>
  )
}

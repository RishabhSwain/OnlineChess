"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Code } from "lucide-react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useAuth();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/signup", { username, password });
      setUser(res.data.user);
      router.push("/menu");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* background glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[120px] rounded-full -bottom-40 -right-40 animate-pulse" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <form
          onSubmit={submit}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-10 space-y-8"
        >
          {/* header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Create account
            </h1>
            <p className="text-neutral-400 text-sm">
              Join and start using the app
            </p>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          {/* username */}
          <div className="relative">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="absolute left-4 top-2 text-xs text-neutral-400">
              Username
            </label>
          </div>

          {/* password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 pr-12 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="absolute left-4 top-2 text-xs text-neutral-400">
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition active:scale-90"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* signup button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition active:scale-[0.97] shadow-lg shadow-blue-600/40"
          >
            Sign up
          </button>

          {/* footer */}
          <p className="text-sm text-neutral-400 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>

        {/* developer credit */}
        <p className="flex items-center justify-center gap-2 text-xs text-neutral-500 mt-6">
          <Code size={14} />
          Developed by<span className="text-neutral-300 font-bold">Rishi</span>
        </p>
      </div>
    </div>
  );
}

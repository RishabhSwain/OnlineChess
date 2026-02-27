import { use } from "react";

type ChatUIProps = {
  opponent: string;
  self: string;
};

export default function ChatUI({ opponent, self }: ChatUIProps) {
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl shadow-lg">

      {/* Header */}
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 font-semibold tracking-wide rounded-tl-xl rounded-tr-xl">
        ⚡ Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Bot Message */}
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            {opponent ? opponent[0].toUpperCase() : "O"}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow max-w-md">
            Welcome to the dark side. Ask me anything.
          </div>
        </div>

        {/* User Message */}
        <div className="flex items-start gap-3 justify-end">
          <div className="bg-indigo-600 text-white p-3 rounded-xl shadow max-w-md">
            This UI looks sick.
          </div>
          <div className="h-9 w-9 bg-zinc-700 rounded-full flex items-center justify-center shadow">
            {self ? self[0].toUpperCase() : "S"}
          </div>
        </div>

      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2 rounded-bl-xl rounded-br-xl">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-xl font-medium shadow">
          Send
        </button>
      </div>
    </div>
  );
}
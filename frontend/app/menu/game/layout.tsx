"use client";

import SocketProvider from "@/providers/socketProvider";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}

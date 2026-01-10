import { NextResponse } from "next/server";

let rooms: Record<string, { players: string[] }> = {};

export async function POST(req: Request) {
  const id = Math.random().toString(36).slice(2, 8);
  rooms[id] = { players: [] };
  return NextResponse.json({ roomId: id });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const roomId = url.searchParams.get("id");
  if (roomId && rooms[roomId]) {
    return NextResponse.json({ exists: true });
  }
  return NextResponse.json({ exists: false });
}

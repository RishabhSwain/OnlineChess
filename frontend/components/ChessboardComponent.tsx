import { useState, useEffect } from "react";
import { Chessboard, PieceDropHandlerArgs } from "react-chessboard";
import { chessGame } from "@/domain/chess/ChessLogic";

import { useGameStore } from "@/store/gameStore";

import { socket } from "@/lib/socket";
import api from "@/lib/axios";

export default function ChessboardComponent({
  gameId,
  gameData,
}: {
  gameId: string;
  gameData: { fen: string; turn: "white" | "black"; state: any } | null;
}) {
  const [sourceSquare, setSourceSquare] = useState<string>("None");
  const [targetSquare, setTargetSquare] = useState<string>("None");

  const [position, setPosition] = useState(chessGame.getFen());

  const fen = useGameStore((s) => s.fen);
  const setFen = useGameStore((s) => s.setFen);
  const turn = useGameStore((s) => s.turn);
  const setTurn = useGameStore((s) => s.setTurn);
  const ownColor = useGameStore((s) => s.ownColor);

  // useEffect(() => {
  //   setPosition(gameData?.fen || chessGame.getFen());
  //   setFen(gameData?.fen || chessGame.getFen());
  //   setTurn(gameData?.turn || "white");
  // }, [gameData]);

  useEffect(() => {
    const handleGameState = (data: { fen: string; lastMove: any }) => {
      setPosition(data.fen);
      setFen(data.fen);


    };

    const handleInvalidMove = () => {
      alert("Invalid move!");
    };

    socket.on("game-state", handleGameState);
    socket.on("invalid-move", handleInvalidMove);

    return () => {
      socket.off("game-state", handleGameState);
      socket.off("invalid-move", handleInvalidMove);
    };
  }, []);

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
    piece,
  }: PieceDropHandlerArgs) => {
    setSourceSquare(sourceSquare);
    setTargetSquare(targetSquare || "None");

    socket.emit("move", {
      gameId,
      move: { from: sourceSquare, to: targetSquare, promotion: "q" },
    });
    return true;

    // const move = chessGame.makeMove(sourceSquare, targetSquare!);

    // if (move === null) return false;

    // setPosition(chessGame.getFen());
    // return true;
  };

  const chessboardOptions = {
    darkSquareStyle: {
      backgroundColor: "lightBlue",
    },
    lightSquareStyle: {
      backgroundColor: "white",
    },
    boardStyle: {
      borderRadius: "10px",
      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
      border: "1px solid #000",
      margin: "20px 0",
    },
    onPieceDrop,
    position: position,
    boardOrientation: ownColor,
  };

  return <Chessboard options={chessboardOptions} />;
}

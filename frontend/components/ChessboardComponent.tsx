import { useState, useEffect } from "react";
import { Chessboard, PieceDropHandlerArgs } from "react-chessboard";
import { chessGame } from "@/domain/chess/ChessLogic";

import { socket } from "@/lib/socket";

export default function ChessboardComponent({ gameId }: { gameId: string }) {
  const [sourceSquare, setSourceSquare] = useState<string>("None");
  const [targetSquare, setTargetSquare] = useState<string>("None");
  

  const [position, setPosition] = useState(chessGame.getFen());

  useEffect(() => {
  const handleGameState = (data: { fen: string; lastMove: any }) => {
    setPosition(data.fen);
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

    socket.emit("move", { gameId, move: { from: sourceSquare, to: targetSquare, promotion: "q" } });
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
  };

  return <Chessboard options={chessboardOptions} />;
}

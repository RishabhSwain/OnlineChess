import { useState } from "react";
import { Chessboard, PieceDropHandlerArgs } from "react-chessboard";
import { chessGame } from "@/domain/chess/ChessLogic";

export default function ChessboardComponent() {
  const [sourceSquare, setSourceSquare] = useState<string>("None");
  const [targetSquare, setTargetSquare] = useState<string>("None");
  

  const [position, setPosition] = useState(chessGame.getFen());

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
    piece,
  }: PieceDropHandlerArgs) => {
    setSourceSquare(sourceSquare);
    setTargetSquare(targetSquare || "None");
    

    const move = chessGame.makeMove(sourceSquare, targetSquare!);

    if (move === null) return false;

    setPosition(chessGame.getFen());
    return true;
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

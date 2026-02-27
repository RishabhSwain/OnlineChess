import { Chess } from "chess.js";

class ChessGame {
  private game: Chess;

  constructor() {
    this.game = new Chess();
  }

  makeMove(from: string, to: string) {
    try{
      return this.game.move({
        from,
        to,
        promotion: "q",
      });
    } catch (error) {
      console.error("Error making move:", error);
      return null;
    }
  }

  getFen() {
    return this.game.fen();
  }

  reset() {
    this.game.reset();
  }

  isGameOver() {
    return this.game.isGameOver();
  }
}

export const chessGame = new ChessGame();

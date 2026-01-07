import { Chess } from "chess.js";

class ChessGame {
  private game: Chess;

  constructor() {
    this.game = new Chess();
  }

  makeMove(from: string, to: string) {
    return this.game.move({
      from,
      to,
      promotion: "q",
    });
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

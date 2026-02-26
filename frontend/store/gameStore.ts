import { create } from "zustand";

type GameState = {
  fen: string;
  turn: "white" | "black";
  ownColor: "white" | "black";
  opponentPresent: boolean;

  setFen: (fen: string) => void;
  setTurn: (turn: GameState["turn"]) => void;
  setOwnColor: (color: GameState["ownColor"]) => void;
  setOpponentPresent: (present: boolean) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  turn: "white",
  ownColor: "white",
  opponentPresent: false,

  setFen: (fen) => set({ fen }),
  setTurn: (turn) => set({ turn }),
  setOwnColor: (ownColor) => set({ ownColor }),
  setOpponentPresent: (present) => set({ opponentPresent: present }),

  resetGame: () =>
    set({
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      turn: "white",
        ownColor: "white",
        opponentPresent: false,
    }),
}));
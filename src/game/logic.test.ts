import { describe, it, expect } from "vitest";
import {
  BOARD_SIZE,
  WIN_LENGTH,
  createEmptyBoard,
  inBounds,
  getCell,
  setCellImmutable,
  findWinningLineFromLastMove,
  initialState,
  reducer,
  Player,
  Cell,
} from "./logic";

describe("pure game logic", () => {
  describe("createEmptyBoard", () => {
    it("creates a board with specified dimensions filled with null", () => {
      const board = createEmptyBoard(5);
      expect(board).toHaveLength(5);
      expect(board.every((row) => row.length === 5 && row.every((c) => c === null))).toBe(true);
    });

    it("creates standard 30x30 board", () => {
      const board = createEmptyBoard(BOARD_SIZE);
      expect(board).toHaveLength(30);
      expect(board[0]!).toHaveLength(30);
    });
  });

  describe("inBounds", () => {
    it("returns true for coordinates within board boundaries", () => {
      expect(inBounds(10, 0, 0)).toBe(true);
      expect(inBounds(10, 5, 5)).toBe(true);
      expect(inBounds(10, 9, 9)).toBe(true);
    });

    it("returns false for coordinates outside board boundaries", () => {
      expect(inBounds(10, -1, 0)).toBe(false);
      expect(inBounds(10, 0, -1)).toBe(false);
      expect(inBounds(10, 10, 5)).toBe(false);
      expect(inBounds(10, 5, 10)).toBe(false);
      expect(inBounds(10, 100, 100)).toBe(false);
    });
  });

  describe("getCell", () => {
    it("retrieves cell value accurately", () => {
      const board = createEmptyBoard(5);
      expect(getCell(board, 2, 2)).toBeNull();
      board[2]![2] = "X";
      expect(getCell(board, 2, 2)).toBe("X");
    });

    it("returns null for out of bounds access", () => {
      const board = createEmptyBoard(5);
      expect(getCell(board, 10, 10)).toBeNull();
      expect(getCell(board, -1, 0)).toBeNull();
    });
  });

  describe("setCellImmutable", () => {
    it("returns a new board instance without mutating the input board", () => {
      const original = createEmptyBoard(5);
      const updated = setCellImmutable(original, 1, 2, "X");

      expect(updated).not.toBe(original);
      expect(updated[1]).not.toBe(original[1]);
      expect(updated[0]).toBe(original[0]); // Unmodified rows can share references
      expect(getCell(original, 1, 2)).toBeNull();
      expect(getCell(updated, 1, 2)).toBe("X");
    });
  });

  describe("findWinningLineFromLastMove", () => {
    it("detects a horizontal 5-in-a-row", () => {
      let board = createEmptyBoard(10);
      for (let c = 1; c <= 5; c++) {
        board = setCellImmutable(board, 3, c, "X");
      }
      const win = findWinningLineFromLastMove(board, 3, 5, "X", WIN_LENGTH);
      expect(win).not.toBeNull();
      expect(win).toHaveLength(5);
      expect(win).toEqual([
        { r: 3, c: 1 },
        { r: 3, c: 2 },
        { r: 3, c: 3 },
        { r: 3, c: 4 },
        { r: 3, c: 5 },
      ]);
    });

    it("detects a vertical 5-in-a-row", () => {
      let board = createEmptyBoard(10);
      for (let r = 2; r <= 6; r++) {
        board = setCellImmutable(board, r, 4, "0");
      }
      const win = findWinningLineFromLastMove(board, 4, 4, "0", WIN_LENGTH);
      expect(win).not.toBeNull();
      expect(win).toHaveLength(5);
      expect(win).toEqual([
        { r: 2, c: 4 },
        { r: 3, c: 4 },
        { r: 4, c: 4 },
        { r: 5, c: 4 },
        { r: 6, c: 4 },
      ]);
    });

    it("detects a diagonal (down-right) 5-in-a-row", () => {
      let board = createEmptyBoard(10);
      for (let i = 0; i < 5; i++) {
        board = setCellImmutable(board, i, i, "X");
      }
      const win = findWinningLineFromLastMove(board, 2, 2, "X", WIN_LENGTH);
      expect(win).not.toBeNull();
      expect(win).toHaveLength(5);
      expect(win).toEqual([
        { r: 0, c: 0 },
        { r: 1, c: 1 },
        { r: 2, c: 2 },
        { r: 3, c: 3 },
        { r: 4, c: 4 },
      ]);
    });

    it("detects an anti-diagonal (down-left) 5-in-a-row", () => {
      let board = createEmptyBoard(10);
      const coords = [
        { r: 1, c: 5 },
        { r: 2, c: 4 },
        { r: 3, c: 3 },
        { r: 4, c: 2 },
        { r: 5, c: 1 },
      ];
      for (const { r, c } of coords) {
        board = setCellImmutable(board, r, c, "0");
      }
      const win = findWinningLineFromLastMove(board, 3, 3, "0", WIN_LENGTH);
      expect(win).not.toBeNull();
      expect(win).toEqual(coords);
    });

    it("returns null when fewer than 5 consecutive marks exist", () => {
      let board = createEmptyBoard(10);
      for (let c = 1; c <= 4; c++) {
        board = setCellImmutable(board, 3, c, "X");
      }
      expect(findWinningLineFromLastMove(board, 3, 4, "X", WIN_LENGTH)).toBeNull();
    });

    it("returns null if contiguous marks belong to the other player", () => {
      let board = createEmptyBoard(10);
      for (let c = 1; c <= 5; c++) {
        board = setCellImmutable(board, 3, c, "0");
      }
      expect(findWinningLineFromLastMove(board, 3, 5, "X", WIN_LENGTH)).toBeNull();
    });

    it("handles winning sequence at the boundary of a 30x30 board", () => {
      let board = createEmptyBoard(BOARD_SIZE);
      for (let c = 25; c < 30; c++) {
        board = setCellImmutable(board, 29, c, "X");
      }
      const win = findWinningLineFromLastMove(board, 29, 29, "X", WIN_LENGTH);
      expect(win).not.toBeNull();
      expect(win).toHaveLength(5);
    });
  });
});

describe("reducer and game state transitions", () => {
  it("initializes to default starting state", () => {
    const state = initialState(BOARD_SIZE);
    expect(state.size).toBe(30);
    expect(state.current).toBe("X");
    expect(state.winner).toBeNull();
    expect(state.winningLine).toBeNull();
    expect(state.moves).toBe(0);
    expect(state.board.length).toBe(30);
  });

  it("advances turn and moves on a valid PLAY action", () => {
    const state = initialState(10);
    const nextState = reducer(state, { type: "PLAY", r: 4, c: 4 });

    expect(nextState.moves).toBe(1);
    expect(nextState.board[4]![4]).toBe("X");
    expect(nextState.current).toBe("0");
    expect(nextState.winner).toBeNull();
  });

  it("alternates player turns from X to 0 to X", () => {
    let state = initialState(10);
    state = reducer(state, { type: "PLAY", r: 0, c: 0 });
    expect(state.current).toBe("0");
    expect(state.board[0]![0]).toBe("X");

    state = reducer(state, { type: "PLAY", r: 0, c: 1 });
    expect(state.current).toBe("X");
    expect(state.board[0]![1]).toBe("0");
  });

  it("ignores PLAY action on already occupied cell", () => {
    let state = initialState(10);
    state = reducer(state, { type: "PLAY", r: 2, c: 2 });
    const sameState = reducer(state, { type: "PLAY", r: 2, c: 2 });

    expect(sameState).toBe(state);
    expect(sameState.moves).toBe(1);
    expect(sameState.current).toBe("0");
  });

  it("ignores PLAY action with out-of-bounds coordinates", () => {
    const state = initialState(10);
    const unchanged = reducer(state, { type: "PLAY", r: 10, c: 10 });
    expect(unchanged).toBe(state);
  });

  it("detects win, sets winner and winningLine, and locks the board", () => {
    let state = initialState(10);
    // X plays (0,0), 0 plays (1,0)
    // X plays (0,1), 0 plays (1,1)
    // X plays (0,2), 0 plays (1,2)
    // X plays (0,3), 0 plays (1,3)
    // X plays (0,4) -> X wins!
    for (let c = 0; c < 4; c++) {
      state = reducer(state, { type: "PLAY", r: 0, c }); // X
      state = reducer(state, { type: "PLAY", r: 1, c }); // 0
    }
    state = reducer(state, { type: "PLAY", r: 0, c: 4 }); // X wins

    expect(state.winner).toBe("X");
    expect(state.winningLine).toHaveLength(5);
    expect(state.moves).toBe(9);

    // Further moves should be ignored once a winner is present
    const afterWin = reducer(state, { type: "PLAY", r: 5, c: 5 });
    expect(afterWin).toBe(state);
  });

  it("resets game on NEW_GAME action", () => {
    let state = initialState(10);
    state = reducer(state, { type: "PLAY", r: 2, c: 2 });
    state = reducer(state, { type: "PLAY", r: 2, c: 3 });

    const resetState = reducer(state, { type: "NEW_GAME" });
    expect(resetState.moves).toBe(0);
    expect(resetState.current).toBe("X");
    expect(resetState.winner).toBeNull();
    expect(resetState.winningLine).toBeNull();
    expect(resetState.board[2]![2]).toBeNull();
  });
});

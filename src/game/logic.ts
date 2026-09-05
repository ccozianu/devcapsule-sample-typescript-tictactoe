export const BOARD_SIZE = 30;
export const WIN_LENGTH = 5;

export type Player = "X" | "0";
export type Cell = Player | null;
export type Coord = { r: number; c: number };

export type GameState = {
  size: number;
  board: Cell[][];
  current: Player;
  winner: Player | null;
  winningLine: Coord[] | null;
  moves: number;
};

export type Action =
  | { type: "PLAY"; r: number; c: number }
  | { type: "NEW_GAME" };

/* Pure game logic functions */
export function createEmptyBoard(size: number): Cell[][] {
  return Array.from({ length: size }, () => Array<Cell>(size).fill(null));
}

export function inBounds(size: number, r: number, c: number): boolean {
  return r >= 0 && r < size && c >= 0 && c < size;
}

export function getCell(board: Cell[][], r: number, c: number): Cell {
  return board[r]?.[c] ?? null;
}

export function setCellImmutable(board: Cell[][], r: number, c: number, value: Cell): Cell[][] {
  const next = board.slice();
  const nextRow = next[r]!.slice();
  nextRow[c] = value;
  next[r] = nextRow;
  return next;
}

export function findWinningLineFromLastMove(
  board: Cell[][],
  r: number,
  c: number,
  player: Player,
  winLength: number = WIN_LENGTH,
): Coord[] | null {
  const size = board.length;
  const directions: Array<[number, number]> = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal \
    [1, -1],  // anti-diagonal /
  ];

  for (const [dr, dc] of directions) {
    const line: Coord[] = [];
    let rr = r;
    let cc = c;
    while (inBounds(size, rr - dr, cc - dc) && getCell(board, rr - dr, cc - dc) === player) {
      rr -= dr;
      cc -= dc;
    }
    while (inBounds(size, rr, cc) && getCell(board, rr, cc) === player) {
      line.push({ r: rr, c: cc });
      rr += dr;
      cc += dc;
    }
    if (line.length >= winLength) {
      const index = line.findIndex((point) => point.r === r && point.c === c);
      if (index === -1) continue;
      let start = Math.max(0, index - (winLength - 1));
      start = Math.min(start, line.length - winLength);
      return line.slice(start, start + winLength);
    }
  }
  return null;
}

/* Reducer and state management */
export function initialState(size: number = BOARD_SIZE): GameState {
  return {
    size,
    board: createEmptyBoard(size),
    current: "X",
    winner: null,
    winningLine: null,
    moves: 0,
  };
}

export function reducer(state: GameState, action: Action): GameState {
  if (action.type === "NEW_GAME") return initialState(state.size);
  if (state.winner || !inBounds(state.size, action.r, action.c)) return state;
  if (state.board[action.r]![action.c] !== null) return state;

  const player = state.current;
  const board = setCellImmutable(state.board, action.r, action.c, player);
  const winningLine = findWinningLineFromLastMove(board, action.r, action.c, player, WIN_LENGTH);
  return {
    ...state,
    board,
    current: winningLine ? player : player === "X" ? "0" : "X",
    winner: winningLine ? player : null,
    winningLine,
    moves: state.moves + 1,
  };
}

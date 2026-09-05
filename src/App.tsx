import React, { useCallback, useMemo, useReducer } from "react";
import {
  BOARD_SIZE,
  Cell,
  initialState,
  reducer,
} from "./game/logic";

/* Rendering: presentational board and cell components. */
type CellViewProps = {
  value: Cell;
  isWinning: boolean;
  disabled: boolean;
  onClick: () => void;
};

const CellView = React.memo(function CellView({ value, isWinning, disabled, onClick }: CellViewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
      style={{
        width: 22, height: 22, lineHeight: "22px", padding: 0,
        border: "1px solid rgba(0,0,0,0.15)",
        background: isWinning ? "rgba(255, 215, 0, 0.45)" : "white",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 14,
        fontWeight: 700, userSelect: "none",
      }}
    >
      {value ?? ""}
    </button>
  );
});

type BoardViewProps = {
  board: Cell[][];
  winningSet: Set<string>;
  locked: boolean;
  onPlay: (r: number, c: number) => void;
};

function BoardView({ board, winningSet, locked, onPlay }: BoardViewProps) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: `repeat(${board.length}, 22px)`, gap: 0,
      background: "rgba(0,0,0,0.06)", padding: 6, borderRadius: 10, width: "max-content",
    }}>
      {board.map((row, r) => row.map((value, c) => {
        const key = `${r},${c}`;
        return <CellView key={key} value={value} isWinning={winningSet.has(key)}
          disabled={locked || value !== null} onClick={() => onPlay(r, c)} />;
      }))}
    </div>
  );
}

/* Event handling and composition. */
export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(BOARD_SIZE));
  const onPlay = useCallback((r: number, c: number) => dispatch({ type: "PLAY", r, c }), []);
  const onNewGame = useCallback(() => dispatch({ type: "NEW_GAME" }), []);
  const locked = state.winner !== null;
  const winningSet = useMemo(() => new Set((state.winningLine ?? []).map(({ r, c }) => `${r},${c}`)),
    [state.winningLine]);
  const status = state.winner ? `Winner: ${state.winner} (5 in a row)` : `Turn: ${state.current}`;

  return (
    <div style={{ padding: 16, display: "grid", gap: 12, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: 18 }}>5-in-a-row Tic-Tac-Toe (30×30)</h1>
        <button type="button" onClick={onNewGame} style={{
          padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)",
          background: "white", cursor: "pointer", fontWeight: 700,
        }}>Start new game</button>
        <div role="status" aria-live="polite" style={{
          padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.10)",
          background: locked ? "rgba(34,197,94,0.10)" : "rgba(59,130,246,0.10)", fontWeight: 700,
        }}>{status}</div>
        <div style={{ opacity: 0.7, fontWeight: 600 }}>Moves: {state.moves}</div>
      </header>
      <div style={{ maxWidth: "100%", overflow: "auto", border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 12, padding: 10, background: "rgba(0,0,0,0.02)" }}>
        <BoardView board={state.board} winningSet={winningSet} locked={locked} onPlay={onPlay} />
      </div>
      <footer style={{ opacity: 0.75, fontSize: 13 }}>
        Click to place <b>X</b> / <b>0</b>. First to get <b>5</b> consecutive marks wins
        (horizontal, vertical, or diagonal).
      </footer>
    </div>
  );
}

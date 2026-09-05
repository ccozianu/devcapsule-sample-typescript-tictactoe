# Implementation Note: Test Infrastructure and Logic Separation

Date: `2026-09-02`  
Author: `test-infra` workstream  
Related Requirement: `R-BOOT-001`  

## Summary

Established the project's automated test infrastructure using Vitest, React Testing Library, and jsdom. Refactored the five-in-a-row game logic by separating pure game rules and reducer state transitions from React presentation components.

## Key Changes

1. **Tooling & Setup**:
   - Installed `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
   - Configured `vite.config.ts` with `test` configuration (jsdom environment, setup file).
   - Added `test` and `test:watch` scripts to `package.json`.
   - Configured `src/test/setup.ts` to extend `@testing-library/jest-dom`.

2. **Game Logic Separation**:
   - Extracted board constants (`BOARD_SIZE = 30`, `WIN_STREAK = 5`), types (`Player`, `CellState`, `WinningLine`, `GameState`, `GameAction`), pure functions (`checkWin`, `isBoardFull`, `createInitialState`), and `gameReducer` into `src/game/logic.ts`.
   - Updated `src/App.tsx` to consume `src/game/logic.ts` while retaining UI rendering and click event delegation.

3. **Test Suite**:
   - Unit tests (`src/game/logic.test.ts` - 21 tests):
     - Initial state creation and defaults.
     - Horizontal, vertical, diagonal, and anti-diagonal win detection.
     - Edge-of-board detection and boundary constraints.
     - Overlapping streaks and incomplete streaks (< 5).
     - Full board detection (draw condition).
     - Reducer actions: `MAKE_MOVE` (turn alternation, cell marking, win locking, invalid move rejection) and `RESET_GAME`.
   - Component / integration tests (`src/App.test.tsx` - 3 tests):
     - Header, game status, and controls rendering.
     - Cell click handling and turn alternation.
     - "Start new game" reset behavior.

## Verification Evidence

- `npm test`: 24/24 tests pass cleanly.
- `npm run build`: Type-check (`tsc -b`) and bundle (`vite build`) succeed without errors.

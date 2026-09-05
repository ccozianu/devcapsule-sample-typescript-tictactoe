# Current Status: Gameplay Enhancements

Mnemonic: `gameplay-enhancements`  
Start Date: `2026-09-02`  
State: `paused`  
Branch Prefix: `gameplay-enhancements/`  
Designated Working Branch: `gameplay-enhancements/ai-and-history`  
Integration Target: `main`  
Delivery Method: `pull-request`  

## Goal

Implement advanced gameplay features including single-player AI mode, move history with undo/redo capability, and configurable board/win-length parameters.

## Current Stage

Paused pending test infrastructure setup.

## Current State

Workstream registered and intentionally paused while `test-infra` establishes a regression safety net.

## Workstream Document Index

- [intake/README.md](intake/README.md) — workstream intake queue
- [intake-dispositions.md](intake-dispositions.md) — append-only intake disposition log

## Active Tasks

1. Specify AI player requirements and decision heuristics.
   Requirements: R-BOOT-001
   Done means: Specification document detailing AI search depth, heuristics, and turn integration.
   Verification: Reviewed spec in engineering docs.
   Reopen if: Game complexity requires alternate algorithm.

2. Design move history and undo/redo state transitions.
   Requirements: R-BOOT-001
   Done means: State model supporting past move inspection and branching or rewind.
   Verification: Reducer design specification.
   Reopen if: Memory/performance issues arise on 30x30 boards.

## Planned Next Task

Resume when `test-infra` merges baseline tests; begin by specifying the AI player heuristic.

## Open Threads

### Awaiting The Human
- Desired AI algorithm level (e.g. pattern-matching / heuristic evaluation vs minimax).

### Weighed And Unresolved
- Configurable board dimensions: whether to allow arbitrary N×M or fixed presets.

### Deliberately Not Preserved
- None.

## Gaps And Exercised Latitude
- None.

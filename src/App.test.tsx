import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("renders header, controls, and initial game status", () => {
    render(<App />);

    expect(screen.getByText("5-in-a-row Tic-Tac-Toe (30×30)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start new game" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Turn: X");
    expect(screen.getByText("Moves: 0")).toBeInTheDocument();
  });

  it("handles move placement and alternates turn", () => {
    render(<App />);

    const cells = screen.getAllByRole("button", { name: "Empty cell" });
    expect(cells.length).toBe(900); // 30x30 board

    // Click first cell
    fireEvent.click(cells[0]!);

    expect(screen.getByRole("status")).toHaveTextContent("Turn: 0");
    expect(screen.getByText("Moves: 1")).toBeInTheDocument();
    expect(cells[0]).toHaveTextContent("X");
    expect(cells[0]).toBeDisabled();
  });

  it("resets game when Start new game button is clicked", () => {
    render(<App />);

    const cells = screen.getAllByRole("button", { name: "Empty cell" });
    fireEvent.click(cells[0]!);

    expect(screen.getByText("Moves: 1")).toBeInTheDocument();

    const newGameBtn = screen.getByRole("button", { name: "Start new game" });
    fireEvent.click(newGameBtn);

    expect(screen.getByText("Moves: 0")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Turn: X");
    expect(cells[0]).toHaveTextContent("");
  });
});

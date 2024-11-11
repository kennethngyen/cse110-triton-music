import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Add this import!
import { BrowserRouter } from "react-router-dom";
import { Timer } from "./timer";

// Mock ALL imports from Timer component
jest.mock("../styles/Timer.css", () => ({}));
jest.mock("../App.css", () => ({}));
jest.mock("../styles/index.css", () => ({}));
jest.mock("../App", () => ({}));
jest.mock("../index", () => ({}));

// Mock document.getElementById
document.getElementById = jest.fn(() => document.createElement("div"));

describe("Timer Component", () => {
  const renderTimer = () => {
    render(
      <BrowserRouter>
        <Timer />
      </BrowserRouter>
    );
  };

  test("timer renders with initial elements", () => {
    renderTimer();
    expect(screen.getByText("START")).toBeInTheDocument();
    expect(screen.getByText("Pomodoro")).toBeInTheDocument();
  });

  test("can add a task", () => {
    renderTimer();
    const input = screen.getByPlaceholderText("Enter your task...");
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("can switch to short break", () => {
    renderTimer();
    fireEvent.click(screen.getByText("Short Break"));
    expect(screen.getByText("05:00")).toBeInTheDocument();
  });

  test("timer starts when clicking start", () => {
    renderTimer();
    const startButton = screen.getByText("START");
    fireEvent.click(startButton);
    expect(screen.getByText("PAUSE")).toBeInTheDocument();
  });
});

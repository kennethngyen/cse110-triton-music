import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Timer } from "./timer";
//"test": "react-scripts test --watchAll --testMatch **/src/**/*.test.tsx", in package.json
// Mock ALL imports from Timer component
jest.mock("../styles/Timer.css", () => ({}));
jest.mock("../App.css", () => ({}));
jest.mock("../styles/index.css", () => ({}));
jest.mock("../App", () => ({}));
jest.mock("../index", () => ({}));

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
    expect(screen.getByText("Long Break")).toBeInTheDocument();
    expect(screen.getByText("Short Break")).toBeInTheDocument();
    expect(screen.getByText("Choose Song")).toBeInTheDocument();
    expect(screen.getByText("Setting")).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  test("can add and delete a task", () => {
    renderTimer();
    // Add task
    const input = screen.getByPlaceholderText("Enter your task...");
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Test Task")).toBeInTheDocument();

    // Delete task
    const deleteButton = screen.getByText("×");
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
  });

  test("can update timer settings", () => {
    renderTimer();
    // Open settings
    fireEvent.click(screen.getByText("Setting"));

    // Change pomodoro time to 30 minutes
    const pomodoroInput = screen.getByLabelText("Pomodoro (minutes):");
    fireEvent.change(pomodoroInput, { target: { value: "30" } });

    // Save settings
    fireEvent.click(screen.getByText("Save Settings"));

    // Check if timer updated to 30:00
    expect(screen.getByText("30:00")).toBeInTheDocument();
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

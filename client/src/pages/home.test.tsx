import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./home";

// // Mock ALL imports from Home component
// jest.mock("../App.css", () => ({}));
// jest.mock("../App", () => ({}));
// jest.mock("../styles/index.css", () => ({}));

describe("Home component", () => {
  const renderHome = () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  test("Home renders", () => {
    renderHome();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });
});

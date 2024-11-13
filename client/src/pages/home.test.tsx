import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./home";

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

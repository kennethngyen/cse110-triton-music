import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Profile } from "./profile";

jest.mock("../App.css", () => ({}));
jest.mock("../styles/index.css", () => ({}));
jest.mock("../App", () => ({}));
jest.mock("../index", () => ({}));

describe("Profile component", () => {
  const renderHome = () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
  };

  test("Profile renders ", () => {
    renderHome();
    expect(screen.getByText("Connect Spotify")).toBeInTheDocument();
    expect(screen.getByText("Your Friends")).toBeInTheDocument();
  });
});

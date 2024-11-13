import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./navbar";

describe("Profile component", () => {
  const renderNav = () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  test("NavBar renders ", () => {
    renderNav();
    expect(screen.getByText("Study")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test("links navigate to correct paths", async () => {
    renderNav();

    // Click the Study link
    fireEvent.click(screen.getByText("Study"));
    expect(window.location.pathname).toBe("/study");

    // Click the Profile link
    fireEvent.click(screen.getByText("Profile"));
    expect(window.location.pathname).toContain("/profile");

    // Click the Home link
    fireEvent.click(screen.getByText("Home"));
    expect(window.location.pathname).toBe("/");
  });
});

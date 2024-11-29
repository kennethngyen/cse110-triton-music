import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Profile } from "./profile";

describe("Profile Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock window.location.search
    Object.defineProperty(window, "location", {
      value: {
        href: "",
        search: "",
      },
      writable: true, // Allows us to modify the location object
    });
  });

  test("renders the Spotify button with default state", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /connect spotify/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent("Connect Spotify");
  });

  test("handles Spotify connection success", () => {
    // Mock query string for success
    window.location.search = "?success=true";

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", {
      name: /connected to spotify/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(localStorage.getItem("spotifyConnectionStatus")).toBe("connected");
  });

  test("handles Spotify connection failure", () => {
    // Mock query string for failure
    window.location.search = "?error=someError";

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /connection failed/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(localStorage.getItem("spotifyConnectionStatus")).toBe("failed");
  });

  test("redirects to Spotify login on button click", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /connect spotify/i });
    fireEvent.click(button);
    expect(window.location.href).toBe("http://localhost:8080/spotifylogin");
  });
});

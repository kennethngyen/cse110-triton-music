import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Signup } from "./signup";

// Mock window.alert
window.alert = jest.fn();

jest.mock(" ../signup", () => ({}));
jest.mock('history', () => ({}));

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Helper function to render the component with Router
const renderWithRouter = (ui: React.ReactElement) => {
  const history = createMemoryHistory();
  return render(
    <Router location={history.location} navigator={history}>
      {ui}
    </Router>
  );
};

describe("Signup Component", () => {
  test("renders Signup form", () => {
    renderWithRouter(<Signup />);
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test("shows alert when username and password are not provided", () => {
    renderWithRouter(<Signup />);
    const signUpButton = screen.getByText(/Sign Up/i);
    fireEvent.click(signUpButton);
    expect(window.alert).toHaveBeenCalledWith("Please enter both username and password to sign up.");
  });

  test("shows success message and navigates to dashboard on successful signup", () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    renderWithRouter(<Signup />);
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signUpButton = screen.getByText(/Sign Up/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(signUpButton);

    expect(window.alert).toHaveBeenCalledWith("Account created successfully! Logging you in...");
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });
});

export {};
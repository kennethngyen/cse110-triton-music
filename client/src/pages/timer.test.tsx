import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Timer } from "./timer";
import { UserContext, UserProvider } from "../contexts/UserContext";
//"test": "react-scripts test --watchAll --testMatch **/src/**/*.test.tsx", in package.json

describe("Timer Component", () => {
    const mockUser = {
		userId: "123",
		username: "testuser",
	};

	const MockUserProvider: React.FC<{ children: React.ReactNode }> = ({
		children,
	}) => (
		<UserContext.Provider
			value={{
				user: mockUser,
				setUser: jest.fn(),
				clearUser: jest.fn(),
                playerReady: false,
                setPlayerReady: jest.fn(),
                player: undefined,
                setPlayer: jest.fn(),
                is_active: false,
                setActive: jest.fn(),
                is_paused: true,
                setPaused: jest.fn(),
                current_track: undefined,
                setTrack: jest.fn(),
			}}
		>
			{children}
		</UserContext.Provider>
	);

	const renderTimer = () => {
		render(
			<BrowserRouter>
				<MockUserProvider>
					<Timer />
				</MockUserProvider>
			</BrowserRouter>
		);
	};

	test("timer renders with initial elements", () => {
		renderTimer();
		expect(screen.getByText("START")).toBeInTheDocument();
		expect(screen.getByText("Pomodoro")).toBeInTheDocument();
		expect(screen.getByText("Long Break")).toBeInTheDocument();
		expect(screen.getByText("Short Break")).toBeInTheDocument();
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

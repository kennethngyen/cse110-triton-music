import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Profile } from "./profile";
import { UserProvider, UserContext } from "../contexts/UserContext";

describe("Profile Component", () => {
	beforeEach(() => {
		localStorage.clear();
		Object.defineProperty(window, "location", {
			value: { href: "", search: "" },
			writable: true,
		});
	});

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

	test("renders the Spotify button with default state", () => {
		render(
			<BrowserRouter>
				<MockUserProvider>
					<Profile />
				</MockUserProvider>
			</BrowserRouter>
		);

		const button = screen.getByRole("button", { name: /connect spotify/i });
		expect(button).toBeInTheDocument();
		expect(button).not.toBeDisabled();
	});

	test("handles Spotify connection success", () => {
		window.location.search = "?success=true";

		render(
			<BrowserRouter>
				<MockUserProvider>
					<Profile />
				</MockUserProvider>
			</BrowserRouter>
		);

		const button = screen.getByRole("button", {
			name: /connected to spotify/i,
		});
		expect(button).toBeInTheDocument();
		expect(button).toBeDisabled();
		expect(localStorage.getItem("spotifyConnectionStatus")).toBe("connected");
	});
});

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./home";
import { UserProvider } from "../contexts/UserContext";

describe("Home component", () => {
	const renderHome = () => {
		render(
			<BrowserRouter>
				<UserProvider>
					<Home />
				</UserProvider>
			</BrowserRouter>
		);
	};

	test("Home renders", () => {
		renderHome();
		expect(screen.getByText("Get Started")).toBeInTheDocument();
		expect(screen.getByText("Log In")).toBeInTheDocument();
	});
});

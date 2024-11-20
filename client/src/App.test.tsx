import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => jest.fn(),
  }));

test("renders Create Note", () => {
	render(
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
});

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import { UserProvider } from "./contexts/UserContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<BrowserRouter>
		<React.StrictMode>
			<UserProvider>
				<App />
			</UserProvider>
		</React.StrictMode>
	</BrowserRouter>
);

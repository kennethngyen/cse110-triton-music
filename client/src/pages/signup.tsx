import "../App.css";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const Signup = () => {
	const { user, setUser } = useUser();

	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">(
		"idle"
	); // Track login status
	const navigate = useNavigate();

	const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:8080/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: username, password: password }),
			});

			if (!response.ok) {
				setLoginStatus("error");
				throw new Error("Invalid credentials");
			}

			const res = await response.json();
			console.log(res);

			setUser({ username: res.user.email, userId: res.user.id });
			localStorage.setItem("token", res.token);
			setLoginStatus("success"); // Set success status

			// Redirect after successful login
			setTimeout(() => {
				navigate("/music-feed");
			}, 2000);
		} catch (err) {
			console.error(err);
			setLoginStatus("error"); // Set error status
		}
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:8080/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: username, password: password }),
			});

			if (!response.ok) {
				throw new Error("Signup failed. User may already exist.");
			}

			const data = await response.json();
			localStorage.setItem("token", data.token);

			alert("Account created successfully! Logging you in...");
			navigate("/dashboard");
		} catch (err) {
			alert(err || "An error occurred during signup.");
		}
	};

	return (
		<div className="relative flex flex-col">
			<main className="flex-1 px-4 sm:px-6 lg:px-8">
				<section className="flex min-h-[calc(100vh-150px)] w-full items-center">
					<div className="container justify-center mx-auto flex flex-col md:flex-row">
						<div className="mb-8 flex items-center justify-center">
							<div className="bg-white rounded-lg shadow-md w-full p-6 space-y-4">
								<h2 className="text-2xl font-bold text-gray-700">Register</h2>
								<form className="space-y-4" onSubmit={handleRegister}>
									<input
										type="text"
										placeholder="Username"
										className="w-full h-10 px-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
										onChange={(e) => setUsername(e.target.value)}
										required
									/>
									<input
										type="password"
										placeholder="Password"
										className="w-full h-10 px-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<button
										type="submit"
										className="w-full h-10 mt-2 rounded-md bg-black text-white font-medium transition-colors hover:bg-black/90"
									>
										Register
									</button>
								</form>

								{/* Login Status Indicator */}
								{loginStatus === "success" && (
									<div className="mt-4 text-green-600 font-semibold">
										✅ Register Successful! Redirecting...
									</div>
								)}
								{loginStatus === "error" && (
									<div className="mt-4 text-red-600 font-semibold">
										❌ Register failed. Please try again.
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

import "../App.css";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const Home = () => {
	const { user, setUser } = useUser();

	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">(
		"idle"
	); // Track login status
	const navigate = useNavigate();

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:8080/login", {
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
				body: JSON.stringify({ email: username, password }),
			});

			if (!response.ok) {
				throw new Error("Signup failed. User may already exist.");
			}

			//const data = await response.json();
			//localStorage.setItem("token", data.token);

			alert("Account created successfully!");
			//navigate("/dashboard");
		} catch (err) {
			alert(err || "An error occurred during signup.");
		}
	};

	return (
		<div className="relative flex flex-col">
			<main className="flex-1 px-4 sm:px-6 lg:px-8">
				<section className="flex min-h-[calc(100vh-150px)] w-full items-center">
					<div className="container mx-auto flex flex-col md:flex-row">
						<div className="md:w-1/2 mb-8 space-y-4">
							<h1 className="pt-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
								Make Your Studying More Musical
							</h1>
							<p className="max-w-[600px] text-gray-500 md:text-xl">
								Triton Music solves your music-studying needs with built-in
								music sharing and Spotify-to-timer integration.
							</p>
							<div className="flex flex-col gap-2 sm:flex-row">
								<button className="inline-flex h-10 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-black/90">
									<Link to="/dashboard">Get Started</Link>
								</button>
							</div>
						</div>
						<div className="md:w-1/2 mb-8 flex items-center justify-center">
							<div className="bg-white rounded-lg shadow-md w-full md:w-1/2 p-6 space-y-4">
								<h2 className="text-2xl font-bold text-gray-700">Login</h2>
								<form className="space-y-4" onSubmit={handleLogin}>
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
										Log In
									</button>
								</form>

								{/* Login Status Indicator */}
								{loginStatus === "success" && (
									<div className="mt-4 text-green-600 font-semibold">
										✅ Login Successful! Redirecting...
									</div>
								)}
								{loginStatus === "error" && (
									<div className="mt-4 text-red-600 font-semibold">
										❌ Invalid credentials. Please try again.
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

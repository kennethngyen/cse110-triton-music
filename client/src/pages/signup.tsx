import "../App";
import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const Signup = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            // Simulate account creation by showing a message or storing data
            alert("Account created successfully! Logging you in...");

            localStorage.setItem("token", "mockSignupToken"); // Store a mock token to indicate logged-in status
            // Redirect to the dashboard
            navigate("/dashboard");
        } else {
            alert("Please enter both username and password to sign up.");
        }
    };

    return (
        <div className="relative flex flex-col">
            <main className="flex-1 px-4 sm:px-6 lg:px-8">
                <section className="flex min-h-[calc(100vh-150px)] w-full items-center">
                    <div className="container mx-auto flex flex-col md:flex-row">
                        <div className="md:w-1/2 mb-8 space-y-4">
                            <h1 className="pt-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                Join Us and Start Your Musical Journey
                            </h1>
                            <p className="max-w-[600px] text-gray-500 md:text-xl">
                                Triton Music helps you integrate music into your studying routine with ease.
                            </p>
                        </div>
                        <div className="md:w-1/2 mb-8 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-md w-full md:w-1/2 p-6 space-y-4">
                                <h2 className="text-2xl font-bold text-gray-700">Sign Up</h2>
                                <form className="space-y-4" onSubmit={handleSignup}>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full h-10 px-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-10 px-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full h-10 mt-2 rounded-md bg-black text-white font-medium transition-colors hover:bg-black/90"
                                    >
                                        Sign Up
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};


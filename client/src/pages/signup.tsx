import "../App.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const Signup = () => {
  const { setUser } = useUser();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">("idle");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
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
        throw new Error("Signup failed. User may already exist.");
      }

      const res = await response.json();

      setUser({ username: res.user.email, userId: res.user.id });
      localStorage.setItem("token", res.token);
      setLoginStatus("success");

      setTimeout(() => {
        navigate("/music-feed");
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoginStatus("error");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length === 30) {
      setWarning("Maximum username length reached");
    } else {
      setWarning(null);
    }
  };

  return (
    <div className="relative flex flex-col">
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <section className="flex min-h-[calc(100vh-150px)] w-full items-center">
          <div className="container justify-center mx-auto flex flex-col md:flex-row">
            <div className="mb-8 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-md w-full p-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Register</h2>
                <form onSubmit={handleRegister} noValidate> {/* Added noValidate */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Username"
                          maxLength={30}
                          className={`w-full h-10 px-4 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black ${
                            warning ? "border-yellow-500 focus:ring-yellow-500" : "border-gray-300"
                          } [&:not(:placeholder-shown):not(:focus):invalid]:border-gray-300`} // Override browser styles
                          value={username}
                          onChange={handleUsernameChange}
                          required
                        />
                        {warning && (
                          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-yellow-500">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                              />
                            
                          </span>
                        )}
                      </div>
                      <div className="h-6"> {/* Fixed height container for warning message */}
                        {warning && (
                          <p className="text-yellow-600 text-sm font-semibold">
                            {warning}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full h-10 px-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black [&:not(:placeholder-shown):not(:focus):invalid]:border-gray-300"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    
                    <button
                      type="submit"
                      className="w-full h-10 rounded-md font-medium transition-colors bg-black text-white hover:bg-black/90"
                    >
                      Register
                    </button>
                  </div>
                </form>

                <div className="h-6 mt-4">
                  {loginStatus === "success" && (
                    <div className="text-green-600 font-semibold">
                      ✅ Register Successful! Redirecting...
                    </div>
                  )}
                  {loginStatus === "error" && (
                    <div className="text-red-600 font-semibold">
                      ❌ Register failed. Please try again.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

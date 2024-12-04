import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/home";
import { Timer } from "./pages/timer";
import { Profile } from "./pages/profile";
import { SpotifyPlayer } from "./pages/spotifyplayer";
import { Toaster } from "sonner";
import { MusicFeed } from "./pages/music-feed-page";
import { useEffect, useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import { json } from "stream/consumers";
import { Signup } from "./pages/signup";

const App = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { setUser } = userContext;

  useEffect(() => {
    const hydrateUserState = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:8080/token-user-id", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            console.error("No match from auth token to User object");
            throw new Error("No match from auth token to User object");
          }

          const jsonData = await response.json();
          setUser({ userId: jsonData.user.id, username: jsonData.user.email });
        } catch (err) {
          console.error("Error fetching user data:", err);
          localStorage.removeItem("token"); // Remove token if it’s invalid
        }
      }
    };

    hydrateUserState();
  }, [setUser]);

  return (
    <div>
      <Toaster richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/music-feed" element={<MusicFeed />} />
        <Route path="/study" element={<Timer />} />
        <Route path="/profile/:name" element={<Profile />} />
        <Route path="/player" element={<SpotifyPlayer />} />
      </Routes>
    </div>
  );
};

export default App;

import "../profile-page.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function Profile() {
  const { name } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [description, setDescription] = useState("");
  const [spotifyStatus, setSpotifyStatus] = useState<
    "idle" | "connected" | "failed"
  >(() => {
    // Initialize state from localStorage
    const savedStatus = localStorage.getItem("spotifyConnectionStatus");
    return (savedStatus as "idle" | "connected" | "failed") || "idle";
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const error = urlParams.get("error");

    if (error) {
      setSpotifyStatus("failed");
      localStorage.setItem("spotifyConnectionStatus", "failed");
    } else if (success === "true") {
      setSpotifyStatus("connected");
      localStorage.setItem("spotifyConnectionStatus", "connected");
    }
  }, []);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleSpotifyConnect = () => {
    window.location.href = "http://localhost:8080/spotifylogin";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getButtonText = () => {
    switch (spotifyStatus) {
      case "connected":
        return "Connected to Spotify";
      case "failed":
        return "Connection Failed";
      default:
        return "Connect Spotify";
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-body">
        <div className="profile-info">
          <div className="profile-picture">
            <div className="circle"></div>
          </div>
          <h2>Your Name</h2>
          <textarea
            className="description-box"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description about yourself..."
          />
          <button
            className={`spotify-connect ${
              spotifyStatus === "connected" ? "connected" : ""
            } ${spotifyStatus === "failed" ? "failed" : ""}`}
            onClick={handleSpotifyConnect}
            disabled={spotifyStatus === "connected"}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
              alt="Spotify"
            />
            {getButtonText()}
          </button>
        </div>
        <div className="friends-section">
          <h3>Your Friends</h3>
          <ul>
            {["Friend A", "Friend B", "Friend C"].map((friend) => (
              <li key={friend} className="friend-item">
                <div className="friend-icon">
                  <div className="circle"></div>
                </div>
                <div className="friend-info">
                  <p>{friend}</p>
                  <p>
                    Just listened to: <a href="#">(Insert Song)</a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="friend-search">
            <input
              type="text"
              placeholder="Search for friends..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

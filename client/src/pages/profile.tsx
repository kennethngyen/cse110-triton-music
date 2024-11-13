import "../App.css";

import { useParams } from "react-router-dom";
import { useState } from "react";

export function Profile() {
  const { name } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [description, setDescription] = useState("");
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="profile-page">
      <div className="profile-body">
        <div className="profile-info">
          <div className="profile-picture">
            {/* Placeholder profile picture */}
            <div className="circle"></div>
          </div>
          <h2>Your Name</h2>
          <textarea
            className="description-box"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description about yourself..."
          />
          <button className="spotify-connect">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
              alt="Spotify"
            />
            Connect Spotify
          </button>
        </div>
        <div className="friends-section">
          <h3>Your Friends</h3>
          <ul>
            {["Friend A", "Friend B", "Friend C"].map((friend) => (
              <li key={friend} className="friend-item">
                <div className="friend-icon">
                  {/* Placeholder friend icon */}
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
          {/* Search Bar for Friends */}
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

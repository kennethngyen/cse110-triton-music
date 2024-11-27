import { Link, useParams } from "react-router-dom";
import "../styles/music-feed-page.css";
import { useState, useEffect } from "react";

// Define the structure of a feed item
interface FeedItem {
  id: string;
  content: string;
  songID: string;
  userID: string;
  username: string;
}

// Define the structure of a song
interface Song {
  id: number;
  name: string;
}

export const MusicFeed = () => {
  // State variables
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSongSelect, setShowSongSelect] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSong, setSelectedSong] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Current user information (Replace with actual user data from context or props)
  const currentUserID: string = "123"; // Replace with actual user ID
  const currentUsername: string = "CurrentUser"; // Replace with actual username

  // Predefined songs list
  const songs: Song[] = [
    { id: 1, name: "Song A" },
    { id: 2, name: "Song B" },
    { id: 3, name: "Song C" },
  ];

  const selectSong = (songName: string): void => {
    setSelectedSong(songName);
    setShowSongSelect(false);
  };

  // Fetch feed items from the backend when the component mounts
  useEffect(() => {
    setIsLoading(true);
    setError("");

    // Ensure the backend URL is consistent.
    fetch("http://localhost:8080/feed")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: { data: FeedItem[] }) => {
        console.log("Fetched feed items:", data.data);
        setFeedItems(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feed data:", error);
        setError("Failed to load feed. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  // Handle sharing a new song by posting to the backend
  const handleShare = (): void => {
    if (!selectedSong) {
      alert("Please select a song before sharing.");
      return;
    }

    const newFeedItem: FeedItem = {
      id: Date.now().toString(), // Generates a unique ID based on timestamp
      content: comments,
      songID: selectedSong,
      userID: currentUserID,
      username: currentUsername,
    };

    // Optimistically update the UI
    setFeedItems([newFeedItem, ...feedItems]);
    setComments("");
    setSelectedSong("");

    // POST the new feed item to the backend
    fetch("http://localhost:5000/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFeedItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: FeedItem) => {
        console.log("Posted new feed item:", data);
      })
      .catch((error) => {
        console.error("Error posting feed item:", error);
        setError("Failed to share the song. Please try again.");
        setFeedItems(feedItems.filter((item) => item.id !== newFeedItem.id));
      });
  };

  return (
    <div className="music-feed">
      <div className="feed-section">
        <ul>
          {/* Share Feature */}
          <div className="share-feature">
            <li className="share-item">
              <div className="share-info">
                <p className="share-text">Share a song</p>
                <input
                  type="text"
                  className="song-comments"
                  placeholder="Thoughts on a song...."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                <button
                  className="music-picker-btn"
                  onClick={() => setShowSongSelect(true)}
                >
                  Choose music
                </button>
                {selectedSong && (
                  <p className="selected-song">Selected Song: {selectedSong}</p>
                )}
                <button className="share-button" onClick={handleShare}>
                  Share
                </button>
              </div>
            </li>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <li className="loading-item">
              <p>Loading feed...</p>
            </li>
          )}

          {/* Error Message */}
          {error && (
            <li className="error-item">
              <p>{error}</p>
            </li>
          )}

          {/* Feed Items */}
          {!isLoading && !error && feedItems.length > 0 ? (
            feedItems.map((item: FeedItem) => (
              <li key={item.id} className="friend-item">
                <div className="friend-info">
                  <p>{item.username} is Listening to...</p>
                  <p className="friend-comment">
                    {item.content}{" "}
                    <a href="#" className="song-description">
                      ({item.songID})
                    </a>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                      className="spotify-logo"
                      alt="Spotify"
                    />
                  </p>
                </div>
              </li>
            ))
          ) : (
            // Fallback message when there are no feed items and not loading
            !isLoading &&
            !error && (
              <li className="no-feed-item">
                <p>No feed items to display.</p>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Song Selection Modal */}
      {showSongSelect && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowSongSelect(false)}
          />
          <div className="song-select-modal">
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for music"
                className="search-input"
              />
            </div>
            <div className="songs-list">
              {songs
                .filter((song) =>
                  song.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((song: Song) => (
                  <button
                    key={song.id}
                    className="song-item"
                    onClick={() => selectSong(song.name)}
                  >
                    <span className="music-note">♪</span>
                    <span className="song-name">{song.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

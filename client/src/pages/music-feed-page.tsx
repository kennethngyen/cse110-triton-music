// frontend/src/pages/music-feed-page.tsx

import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import "../styles/music-feed-page.css";

interface FeedItem {
    id: string;
    songID: string;
    description: string;
    userID: string;
    username: string;
    songName: string; // Added songName to display
}

interface Song {
    id: number;
    name: string;
    spotifyId: string;
}

const SPOTIFY_CLIENT_ID = process.env.REACT_APP_CLIENT_ID as string;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET_ID as string;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

export const MusicFeed = () => {
    // State variables
    const [showSongSelect, setShowSongSelect] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [comments, setComments] = useState<string>("");
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [accessToken, setAccessToken] = useState<string>("");
    const [albums, setAlbums] = useState<any[]>([]);

    // Get current user from context
    const { user } = useUser();
    const token = localStorage.getItem("token");

    // Predefined songs list
    const songs: Song[] = [
        { id: 1, name: "Shape of You", spotifyId: "7qiZfU4dY1lWllzX7mPBI3" },
        { id: 2, name: "Blinding Lights", spotifyId: "0VjIjW4GlUZAMYd2vXMi3b" },
        { id: 3, name: "Levitating", spotifyId: "6JWc4iAiJ9KNSqqNYIRxjL" },
    ];

    // Function to get song name from spotifyId
    const getSongNameBySpotifyId = (spotifyId: string): string => {
        const song = songs.find((song) => song.spotifyId === spotifyId);
        return song ? song.name : "Unknown Song";
    };

    // Select a song and close the modal
    const selectSong = (song: Song): void => {
        setSelectedSong(song);
        setShowSongSelect(false);
    };

    // Fetch feed items when the component mounts or user changes
    useEffect(() => {
        if (!user || !token) return;

        const fetchFeed = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await fetch(`${BACKEND_URL}/feed`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched feed items:", data.data);

                // Map feed items to include songName
                const feedItemsWithSongName = data.data.map((item: FeedItem) => ({
                    ...item,
                    songName: getSongNameBySpotifyId(item.songID),
                }));

                setFeedItems(feedItemsWithSongName);
            } catch (error: any) {
                console.error("Error fetching feed data:", error);
                setError("Failed to load feed. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeed();
    }, [user, token]);

    /**
     * Share a new song by sending a POST request to /feed.
     */
    const shareSong = async (): Promise<void> => {
        if (!selectedSong) {
            alert("Please select a song before sharing.");
            return;
        }

        try {
            if (!token) {
                throw new Error("No authentication token found.");
            }

            const response = await fetch(`${BACKEND_URL}/feed`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    spotifyId: selectedSong.spotifyId,
                    description: comments,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to share the song.");
            }

            const data = await response.json();
            console.log("Shared new feed item:", data.data);

            // Add songName to the new feed item
            const newFeedItem = {
                ...data.data,
                username: user?.username,
                songName: selectedSong.name,
            };

            // Optimistically update the UI
            setFeedItems([newFeedItem, ...feedItems]);
            setComments("");
            setSelectedSong(null);
        } catch (error: any) {
            console.error("Error sharing feed item:", error);
            setError(error.message || "Failed to share the song. Please try again.");
        }
    };

    return (
        <div className="music-feed">
            {!user ? (
                // Render login prompt if user is not logged in
                <div>
                    <h1 className="text-3xl text-center text-red-500">Please log in.</h1>
                </div>
            ) : (
                // Render the feed and share features if user is logged in
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
                                        <p className="selected-song">Selected Song: {selectedSong.name}</p>
                                    )}
                                    <button className="share-button" onClick={shareSong}>
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
                        {!isLoading && !error && feedItems.length > 0
                            ? feedItems.map((item: FeedItem) => (
                                  <li key={item.id} className="friend-item">
                                      <div className="friend-info">
                                          <p>
                                              {item.username} is listening to {item.songName}
                                          </p>
                                          <p className="friend-comment">{item.description}</p>
                                          <p>
                                              <a
                                                  href={`https://open.spotify.com/track/${item.songID}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="song-description"
                                              >
                                                  Listen on Spotify
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
                            : // Fallback message when there are no feed items and not loading
                              !isLoading &&
                              !error && (
                                  <li className="no-feed-item">
                                      <p>No feed items to display.</p>
                                  </li>
                              )}
                    </ul>
                </div>
            )}

            {/* Song Selection Modal */}
            {showSongSelect && user && (
                <>
                    <div
                        className="modal-overlay"
                        onClick={() => setShowSongSelect(false)}
                    />
                    <div className="song-select-modal">
                        <div className="songs-list">
                            {songs.map((song: Song) => (
                                <button
                                    key={song.id}
                                    className="song-item"
                                    onClick={() => selectSong(song)}
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
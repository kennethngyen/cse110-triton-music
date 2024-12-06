import { json, Link, useParams } from "react-router-dom";
import "../styles/music-feed-page.css";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { makeAuthRequest } from "../misc/auth";
import { API_BASE_URL } from "../constants/constants";

// Define the structure of a feed item
interface FeedItem {
	id: string;
	spotifyId: string;
    description: string;
	userID: string;
	username: string;
    songname: string;
}

// Define the structure of a song
interface Song {
	id: number;
	name: string;
    spotifyId: string;
}


export const MusicFeed = () => {
	// State variables
	const [showSettings, setShowSettings] = useState<boolean>(false);
	const [showSongSelect, setShowSongSelect] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [selectedSong, setSelectedSong] = useState<Song | null>(null);
	const [comments, setComments] = useState<string>("");
	const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const [searchInput, setSearchInput] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const [albums, setAlbums] = useState<any[]>([]);
	const [song, setSong] = useState<any[]>([]);

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

	const selectSong = (song: Song): void => {
		setSelectedSong(song);
        console.log("INCOMING SONG");
        console.log(song);
		setShowSongSelect(false);
	};

	// Fetch feed items from the backend when the component mounts
	useEffect(() => {
        if (!user || !token) return;
        
		setIsLoading(true);
		setError("");

		const fetchFeed = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await fetch(`${API_BASE_URL}/feed`, {
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
                }));

                setFeedItems(feedItemsWithSongName);
            } catch (error: any) {
                console.error("Error fetching feed data:", error);
                setError("Failed to load feed. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

		const getSpotifyAccessToken = async () => {
			const jsonData = await makeAuthRequest(`${API_BASE_URL}/spotifytoken`);
			if (jsonData) {
				console.log(jsonData);
				setAccessToken(jsonData.access_token);
			} else {
                setAccessToken("failed");
            }
		};

        fetchFeed();
		getSpotifyAccessToken();
	}, []);

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

            const response = await fetch(`${API_BASE_URL}/feed`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    spotifyId: selectedSong.spotifyId,
                    description: comments,
                    songname: selectedSong.name,
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
                songname: selectedSong.name,
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

	//Search function

	async function search() {
		console.log("Search for " + searchQuery);

		//Get request to get artist ID
		var searchParameters = {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
		};

		var artistID = await fetch(
			"https://api.spotify.com/v1/search?q=" + searchQuery + "&type=artist",
			searchParameters
		)
			.then((response) => response.json())
			.then((data) => {
				return data.artists.items[0].id;
			});

		//Get request with artist ID to grab all albums from artist
		var returnedAlbums = await fetch(
			"https://api.spotify.com/v1/artists/" +
				artistID +
				"/albums" +
				"?include_groups=album&market=US&limit=10",
			searchParameters
		)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				console.log(data.items);
				setAlbums(data.items);
			});
		//Display albums
	}

	async function searchForSong() {
		//Get request to get artist ID
		var searchParameters = {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
		};

		var songTrack = await fetch(
			"https://api.spotify.com/v1/search?q=" +
				searchQuery +
				"&type=track&limit=10",
			searchParameters
		)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				console.log(data.tracks.items);
				setSong(data.tracks.items);
				//return data.tracks.items[0].name;
			});
	}

	//if user not log in, display auth wall
	if (!user) {
		return (
			<div>
				<h1 className="text-3xl text-center text-red-500">Please log in.</h1>
			</div>
		);
	}

    if (accessToken == "failed") {
        return (
			<div>
				<h1 className="text-3xl text-center text-red-500">Please connect your Spotify account.</h1>
			</div>
		);
    }
    if (accessToken == "") {
        return <></>;
    }

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
										<p>{item.username} is listening to {item.songname}</p>
										<p className="friend-comment">
											{item.description}</p>
                                        <p>
                                            <img
												src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
												className="spotify-logo"
												alt="Spotify"
										    />
											<a href={`https://open.spotify.com/track/${item.spotifyId}`} className="song-description"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            >
												Listen on Spotify
											</a>
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
								onChange={(e) => {
									setSearchQuery(e.target.value);
									if (searchQuery.length > 1) {
										searchForSong();
									}
								}}
								placeholder="Search for music"
								className="search-input"

								/*onKeyDown = {event => {
									if (event.key == "Enter") {
										search();
										searchForSong();
									}
								}}*/
							/>
						</div>
						<div className="songs-list">
                            {song.map((track, i) => {
								return (
									<button
										key={track.id}
										className="song-item"
										onClick={() => selectSong({id: track.id, name: track.name, spotifyId: track.id})}
									>
										{track.name}

										<img
											src={track.album.images[0].url}
											width="100"
											height="100"
										></img>
									</button>
								);
							})}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

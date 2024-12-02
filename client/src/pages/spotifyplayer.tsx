import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../constants/constants";

interface SpotifyPlayerProps {
    accessToken: string;
}

export const SpotifyPlayer = () => {
    const [accessToken, setToken] = useState<string | null>(null);

    useEffect(() => {
        const getAccessToken = async () => {
            const token = localStorage.getItem("token");
			if (token) {
				try {
					const response = await fetch(`${API_BASE_URL}/spotifytoken`, {
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
					setToken(jsonData.access_token);
				} catch (err) {
					console.error("Error fetching user data:", err);
					localStorage.removeItem("token"); // Remove token if it’s invalid
				}
			}
        };

        getAccessToken();

    }, []);

    return (
        <div>
          {accessToken ? (
            <SpotifyPlayerHandler accessToken={accessToken} />
          ) : (
            <p>Please log in to Spotify.</p>
          )}
        </div>
      );
};

export const SpotifyPlayerHandler: React.FC<SpotifyPlayerProps> = ({
    accessToken,
}) => {
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Initialize the Spotify Player when the component mounts
    useEffect(() => {
        if (window.Spotify) {
            const player = new window.Spotify.Player({
                name: "React Spotify Player 2",
                getOAuthToken: (cb: Function) => {
                    cb(accessToken);
                },
                volume: 0.5,
            });

            // Set up event listeners for the player
            player.on("initialization_error", (e: any) => {
                console.error(e);
            });

            player.on("authentication_error", (e: any) => {
                console.error(e);
            });

            player.on("account_error", (e: any) => {
                console.error(e);
            });

            player.on("playback_error", (e: any) => {
                console.error(e);
            });

            // When the player is ready
            player.on("ready", ({ device_id }: any) => {
                console.log("The Web Playback SDK is ready.");
                setIsReady(true);
                playerRef.current = player;
            });

            // On playback state change
            player.on("player_state_changed", (state: any) => {
                if (!state) return;
                setIsPlaying(state.paused);
            });

            // Connect the player to Spotify
            player.connect();
            console.log(player)
        }
        console.log(window.Spotify)
        return () => {
            if (playerRef.current) {
                playerRef.current.disconnect();
            }
        };
    }, [accessToken]);

    // Handle play/pause button
    const handlePlayPause = () => {
        if (!playerRef.current) return;

        if (isPlaying) {
            playerRef.current.pause();
        } else {
            playerRef.current.resume();
        }
    };

    // Handle skipping tracks
    const handleSkip = () => {
        if (!playerRef.current) return;
        playerRef.current.skipToNext();
    };

    // Handle going back to previous track
    const handlePrevious = () => {
        if (!playerRef.current) return;
        playerRef.current.skipToPrevious();
    };

    // Render the component
    return (
        <div>
            <h2>Spotify Player</h2>
            {isReady ? (
                <>
                    <button onClick={handlePlayPause}>
                        {isPlaying ? "Play" : "Pause"}
                    </button>
                    <button onClick={handleSkip}>Next</button>
                    <button onClick={handlePrevious}>Previous</button>
                </>
            ) : (
                <p>Loading player...</p>
            )}
        </div>
    );
};

import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../constants/constants";

interface Track {
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
}

interface SpotifyPlayerProps {
    token: string;
}

export const SpotifyPlayer = () => {
    const [accessToken, setToken] = useState<string | null>(null);

    useEffect(() => {
        const getAccessToken = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/spotifytoken`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (!response.ok) {
                        console.error(
                            "No match from auth token to User object"
                        );
                        throw new Error(
                            "No match from auth token to User object"
                        );
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
                <SpotifyPlayerHandler token={accessToken} />
            ) : (
                <p>Please log in to Spotify.</p>
            )}
        </div>
    );
};

const SpotifyPlayerHandler: React.FC<SpotifyPlayerProps> = (props) => {
    const [is_paused, setPaused] = useState<boolean>(false);
    const [is_active, setActive] = useState<boolean>(false);
    const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
    const [current_track, setTrack] = useState<Track | undefined>(undefined);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Triton Music Web Playback SDK",
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(props.token);
                },
                volume: 0.5,
            });

            setPlayer(player);

            player.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
            });

            player.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.addListener("player_state_changed", (state) => {
                if (!state) return;

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then((state) => {
                    !state ? setActive(false) : setActive(true);
                });
            });

            player.connect();
        };
    }, []);

    if (!is_active) {
        return (
            <div className="container">
                <div className="main-wrapper">
                    <b>
                        Instance not active. Transfer your playback using your
                        Spotify app
                    </b>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <div className="main-wrapper">
                    {current_track && (
                        <>
                            <img
                                src={current_track.album.images[0].url}
                                className="now-playing__cover"
                                alt=""
                            />
                            <div className="now-playing__side">
                                <div className="now-playing__name">
                                    {current_track.name}
                                </div>
                                <div className="now-playing__artist">
                                    {current_track.artists[0].name}
                                </div>

                                <button
                                    className="btn-spotify"
                                    onClick={() => player?.previousTrack()}
                                >
                                    &lt;&lt;
                                </button>

                                <button
                                    className="btn-spotify"
                                    onClick={() => player?.togglePlay()}
                                >
                                    {is_paused ? "PLAY" : "PAUSE"}
                                </button>

                                <button
                                    className="btn-spotify"
                                    onClick={() => player?.nextTrack()}
                                >
                                    &gt;&gt;
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
};

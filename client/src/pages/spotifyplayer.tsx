import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../constants/constants";
import { makeAuthRequest } from "../misc/auth";
import "../styles/spotifyplayer.css";

interface Track {
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
}

interface SpotifyDrillingProps {
    player: Spotify.Player | undefined;
    setPlayer: React.Dispatch<React.SetStateAction<Spotify.Player | undefined>>; // Type for setPlayer function
    is_active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SpotifyPlayerProps {
    player: Spotify.Player | undefined;
    setPlayer: React.Dispatch<React.SetStateAction<Spotify.Player | undefined>>; // Type for setPlayer function
    is_active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    token: string;
}

export const SpotifyPlayer: React.FC<SpotifyDrillingProps> = ({ player, setPlayer, is_active, setActive }: SpotifyDrillingProps) => {
    const [accessToken, setToken] = useState<string | null>(null);

    useEffect(() => {
        const getAccessToken = async () => {
            const jsonData = await makeAuthRequest(`${API_BASE_URL}/spotifytoken`);
            if (jsonData) {
                setToken(jsonData.access_token);
            }
        };

        getAccessToken();
    }, []);

    return (
        <div>
            {accessToken ? (
                <SpotifyPlayerHandler token={accessToken} player={player} setPlayer={setPlayer} is_active={is_active} setActive={setActive} />
            ) : (
                <p>Please log in to Spotify.</p>
            )}
        </div>
    );
};

const SpotifyPlayerHandler: React.FC<SpotifyPlayerProps> = ({ token, player, setPlayer, is_active, setActive }: SpotifyPlayerProps) => {
    const [is_paused, setPaused] = useState<boolean>(false);
    //const [is_active, setActive] = useState<boolean>(false);
    //const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
    const [current_track, setTrack] = useState<Track | undefined>(undefined);
    const count = useRef(1);
    const playerInitialized = useRef(false);

    useEffect(() => {
        if (playerInitialized.current) return;  // If player is already initialized, skip

        if (!document.getElementById("spotify-sdk-script")) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            script.id = "spotify-sdk-script";  // Add an ID to avoid duplicate scripts
            document.body.appendChild(script);
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            if (player) {
                console.log("Player is already initialized");
                return; // If player is already initialized, prevent double initialization
            }
            
            const newPlayer = new window.Spotify.Player({
                name: "Triton Music Web Playback SDK" + count.current,
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(token);
                },
                volume: 0.5,
            });

            newPlayer.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
            });

            newPlayer.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            newPlayer.addListener("player_state_changed", (state) => {
                if (!state) return;

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                if (newPlayer) {
                    newPlayer.getCurrentState().then((state) => {
                        !state ? setActive(false) : setActive(true);
                    }).catch((error) => {
                        console.error("Error getting current state", error);
                    });
                }
            });

            newPlayer.connect();
            setPlayer(newPlayer);

            playerInitialized.current = true;

            count.current += 1;
        };

        return () => {
            if (player) {
                player.disconnect();  // Clean up the player instance on unmount
            }
        };
    }, [token]);

    if (!player) {
        return <p>Loading Spotify player...</p>;
    }

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
                                className={`now-playing__cover ${!is_paused ? 'playing' : ''}`}
                                alt=""
                                width="200"
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

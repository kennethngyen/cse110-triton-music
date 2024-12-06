// UserContext.tsx
import React, { createContext, useContext, useState } from "react";

interface User {
	userId: string;
	username: string;
}

interface Track {
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
}

interface UserContextType {
	user: User | null;
	setUser: (user: User) => void;
	clearUser: () => void;
    playerReady: boolean;
    setPlayerReady: (playerReady: boolean) => void;
    player: Spotify.Player | undefined;
    setPlayer: (player: Spotify.Player) => void;
    is_active: boolean;
    setActive: (is_active: boolean) => void;
    is_paused: boolean;
    setPaused: (is_paused: boolean) => void;
    current_track: Track | undefined;
    setTrack: (current_track: Track) => void; 
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	const clearUser = () => setUser(null);

    const [playerReady, setPlayerReady] = useState<boolean>(false);
    const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
    const [is_active, setActive] = useState<boolean>(false);

    const [is_paused, setPaused] = useState<boolean>(false);
    const [current_track, setTrack] = useState<Track | undefined>(undefined);


	return (
		//create a user context with user, setUser, and clearUser utilities
		<UserContext.Provider value={{ user, setUser, clearUser, playerReady, setPlayerReady, player, setPlayer, is_active, setActive, is_paused, setPaused, current_track, setTrack }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

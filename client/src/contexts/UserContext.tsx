// UserContext.tsx
import React, { createContext, useContext, useState } from "react";

interface User {
	userId: string;
	username: string;
}

interface UserContextType {
	user: User | null;
	setUser: (user: User) => void;
	clearUser: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	const clearUser = () => setUser(null);

	return (
		//create a user context with user, setUser, and clearUser utilities
		<UserContext.Provider value={{ user, setUser, clearUser }}>
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

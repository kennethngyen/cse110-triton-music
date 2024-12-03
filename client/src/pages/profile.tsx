import "../profile-page.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { User } from "../types/types";

export function Profile() {
	const { user, setUser } = useUser();
	const { name } = useParams();
	const [searchQuery, setSearchQuery] = useState("");
	const [description, setDescription] = useState("");
	const [users, setUsers] = useState([]);
	const [following, setFollowing] = useState([] as User[]);

	const [spotifyStatus, setSpotifyStatus] = useState<
		"idle" | "connected" | "failed"
	>(() => {
		// Initialize state from localStorage
		const savedStatus = localStorage.getItem("spotifyConnectionStatus");
		return (savedStatus as "idle" | "connected" | "failed") || "idle";
	});

	useEffect(() => {
		const fetchFollowing = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					console.error("No token found");
				}

				const response = await fetch("http://localhost:8080/get-following", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					console.error("Failed to fetch following list");
				}

				const data = await response.json();
				console.log(data);
				setFollowing(data.data);
			} catch (error) {
				console.error("Error fetching following list:", error);
			}
		};

		fetchFollowing();
	}, []);

	useEffect(() => {
		// Fetch all users on initial load
		const fetchAllUsers = async () => {
			try {
				const response = await fetch("http://localhost:8080/users");
				if (!response.ok) {
					console.error("Failed to fetch all users");
				}
				const data = await response.json();
				setUsers(data.data); // Assuming the response contains a `data` field with the user array
			} catch (error) {
				console.error("Error fetching all users:", error);
				setUsers([]);
			}
		};

		fetchAllUsers();
	}, []);

	useEffect(() => {
		// Fetch all users on initial load
		const fetchAllUsers = async () => {
			try {
				const response = await fetch("http://localhost:8080/users");
				if (!response.ok) {
					console.error("Failed to fetch all users");
				}
				const data = await response.json();
				setUsers(data.data); // Assuming the response contains a `data` field with the user array
			} catch (error) {
				console.error("Error fetching all users:", error);
				setUsers([]);
			}
		};

		fetchAllUsers();
	}, []);

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

	const handleSearchSubmit = async (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			try {
				const response = await fetch(
					`/users/search?username=${encodeURIComponent(searchQuery)}`
				);
				if (!response.ok) {
					console.error("Failed to fetch users");
				}
				const data = await response.json();
				setUsers(data.data); // Assuming the response contains a `data` field with the user array
			} catch (error) {
				console.error("Error fetching users:", error);
				setUsers([]); // Clear users on error
			}
		}
	};

	const handleFollow = async (followeeId: string) => {
		try {
			const response = await fetch(`http://localhost:8080/follow`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
				body: JSON.stringify({
					follower: user?.userId || null,
					followee: followeeId,
				}),
			});
			if (!response.ok) {
				console.error("Failed to follow user");
			}
			const result = await response.json();
			if (result.success) {
				const followedUser = users.find((u: User) => u.id === followeeId);
				if (followedUser) {
					setFollowing((prevFollowing) => [...prevFollowing, followedUser]);
				}
				alert("Followed successfully!");
			}
		} catch (error) {
			console.error("Error following user:", error);
		}
	};
	const handleSignOut = () => {
		localStorage.removeItem("token");

		window.location.href = "/";
	};

	const handleUnfollow = async (followeeId: string) => {
		try {
			setFollowing(following.filter((f) => f.id !== followeeId));
			const response = await fetch(`http://localhost:8080/unfollow`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					followee: followeeId,
				}),
			});
			if (!response.ok) {
				console.error("Failed to unfollow user");
			}
			alert("Unfollowed successfully!");
		} catch (error) {
			console.error("Error unfollowing user:", error);
		}
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

	if (!user) {
		return (
			<div>
				<h1 className="text-3xl text-center text-red-500">Please log in.</h1>
			</div>
		);
	}

	return (
		<div className="profile-page">
			<div className="profile-body">
				<div className="profile-info">
					<div className="profile-picture">
						<div className="circle"></div>
					</div>
					<h2>{user?.username}</h2>
					{/* <textarea
						className="description-box"
						value={description}
						onChange={handleDescriptionChange}
						placeholder="Add a description about yourself..."
					/> */}
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
					<div className="bg-gray-200 p-3 mt-4">
						<h3 className="text-xl">Your Following</h3>
						<ul>
							{following.map(
								(friend: { id: string; name: string; email: string }) => (
									<li key={friend.id} className="friend-item">
										<div className="friend-icon">
											<div className="circle"></div>
										</div>
										<div className="friend-info">
											<p>{friend.name}</p>
											<p>{friend.email}</p>
											<p>
												Just listened to: <a href="#">(Insert Song)</a>
											</p>
										</div>
									</li>
								)
							)}
						</ul>
					</div>
					<button
						className="signout-button bg-red-500 text-white mt-4 p-2 rounded"
						onClick={handleSignOut}
					>
						Sign Out
					</button>
				</div>
				<div className="friends-section">
					<div className="friend-search">
						<h3>Search Users</h3>

						<input
							type="text"
							placeholder="Search for users..."
							value={searchQuery}
							onChange={handleSearchChange}
							onKeyDown={handleSearchSubmit}
						/>
						<div className="user-results">
							{users.map((user: { id: string; name: string }) => (
								<div key={user.id} className="user-item">
									<span>{user.name}</span>
									<button
										className="bg-black text-white"
										onClick={() =>
											following.some((f) => f.id === user.id)
												? handleUnfollow(user.id)
												: handleFollow(user.id)
										}
									>
										{following.some((f) => f.id === user.id)
											? "Unfollow"
											: "Follow"}
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

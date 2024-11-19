// These values will be set every time the server starts
// We will eventually use a database instead for data persistence

export const feedItems = [
    {
        id: "0",
        content: "Check this song out!",
        songID: "034f23ac",
        userID: "234eda1",
        username: "michael",
    },
    {
        id: "1",
        content: "finished my midterm with this song>",
        songID: "23fe2a90",
        userID: "89a6be1",
        username: "donald_duck",
    },
];

/**
 * userID: string;
  username: string;
  friends: User[];
 */
export const users = [
    {
        userID: "234eda1",
        username: "michael",
        friends: ["89a6be1"],
    },
    {
        userID: "89a6be1",
        username: "donald_duck",
        friends: [],
    },
];

export const API_BASE_URL = "http://localhost:8080";
export const SPOTIFY_AUTH_REDIRECT = API_BASE_URL + "/callback";

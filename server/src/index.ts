import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import { createFeedEndpoints } from "./feed/feed-endpoints";
import { createAccountEndpoints } from "./account/account-endpoints";
import { createAuthEndpoints } from "./verification/auth-endpoint";
import { feedItems, users } from "./constants";
import { createSpotifyEndpoints } from "./spotify/spotify-endpoints";
import { generateRandomString } from "./misc/random-query";
import { createUserEndpoints } from "./profile/search-users-endpoints";
import { createFollowingEndpoints } from "./profile/following-endpoints";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json()); // IMPORTANT: parses POST request JSON data

// TODO: Allow the state to change periodically
const state = generateRandomString(16);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// Root endpoint to get test if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send({ "data": "Hello, CSE110 Triton Music User" });
  res.status(200);
});

createAuthEndpoints(app);
createFeedEndpoints(app);
createAccountEndpoints(app, users);
createSpotifyEndpoints(app, state);
createUserEndpoints(app);
createFollowingEndpoints(app);

export { app };
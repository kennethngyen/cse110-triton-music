import express from "express";
import { Request, Response } from "express";
import { createFeedEndpoints } from "./feed/feed-endpoints";
import { createAccountEndpoints } from "./account/account-endpoints";
import { feedItems, users } from "./constants";
import { createSpotifyEndpoints } from "./spotify/spotify-endpoints";
import { generateRandomString } from "./misc/random-query";

const app = express();
const port = 8080;

let state = generateRandomString(16);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// Root endpoint to get test if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send({ "data": "Hello, CSE110 Triton Music User" });
  res.status(200);
});

createFeedEndpoints(app, feedItems, users);
createAccountEndpoints(app, users);
createSpotifyEndpoints(app, state);

export { app };
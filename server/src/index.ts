import { Request, Response } from "express";
import { createFeedEndpoints } from "./feed/feed-endpoints";
import { createAccountEndpoints } from "./account/account-endpoints";
import { feedItems, users } from "./constants";

const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Root endpoint to get test if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send({ "data": "Hello, CSE110 Triton Music User" });
  res.status(200);
});

createFeedEndpoints(app, feedItems, users);
createAccountEndpoints(app, users);

export { app };
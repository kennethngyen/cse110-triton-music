import express from "express";
import { Request, Response } from "express";
import { createFeedEndpoints } from "./feed/feed-endpoints";
import { createAccountEndpoints } from "./account/account-endpoints";
import { createAuthEndpoints } from "./verification/auth-endpoint";
import { feedItems, users } from "./constants";


const app = express();
const port = 8080;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// Root endpoint to get test if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send({ "data": "Hello, CSE110 Triton Music User" });
  res.status(200);
});

createAuthEndpoints(app);
createFeedEndpoints(app, feedItems, users);
createAccountEndpoints(app, users);

export { app };
import express from "express";
import { Request, Response } from "express";
import { createEndpoints } from "./account/account-endpoints";


const app = express();
const port = 8080;


<<<<<<< Updated upstream
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

=======
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
>>>>>>> Stashed changes

// Root endpoint to get test if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send({ "data": "Hello, TypeScript Express!" });
  res.status(200);
});

createEndpoints(app);
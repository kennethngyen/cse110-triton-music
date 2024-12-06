import { Request, Response } from "express";
import {
  requestUserAuthorization,
  requestAccessToken,
  requestUserInfo,
  userRequestToken,
} from "./spotify-utils";
import { authenticateToken } from "../verification/auth-utils";

export function createSpotifyEndpoints(app: any, state: string) {
  // ask for authorization
  app.get("/spotifylogin/:userID", (req: Request, res: Response) => {
    requestUserAuthorization(req, res, state);
  });

  // callback
  app.get("/callback", (req: Request, res: Response) => {
    requestAccessToken(req, res, state);
  });

  // get user info
  app.get("/userinfo", authenticateToken, (req: Request, res: Response) => {
    requestUserInfo(req, res);
  });

  // get spotify access token
  app.get("/spotifytoken", authenticateToken, (req: Request, res: Response) => {
    userRequestToken(req, res);
  });
}

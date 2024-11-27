import { Request, Response } from "express";
import {requestUserAuthorization,  requestAccessToken,  requestUserInfo} from "./spotify-utils";

export function createSpotifyEndpoints(app: any, state: string) {
  // ask for authorization
  app.get("/spotifylogin", (req: Request, res: Response) => {
    requestUserAuthorization(req, res, state);
    console.log("Spotify login endpoint hit");
  });

  // callback
  app.get("/callback", (req: Request, res: Response) => {
    console.log("Callback endpoint hit");
    console.log("State passed to callback:", state);
    requestAccessToken(req, res, state);
  });

  // get user info
  app.get("/userinfo", (req: Request, res: Response) => {
    requestUserInfo(req, res);
  });
}

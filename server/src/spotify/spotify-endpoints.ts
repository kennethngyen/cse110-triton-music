import { Request, Response } from "express";
import { requestUserAuthorization, requestAccessToken } from "./spotify-utils";

export function createSpotifyEndpoints(app: any, state: string) {
    // ask for authorization 
    app.get("/spotifylogin", (req: Request, res: Response) => {
        requestUserAuthorization(req, res, state);
    });

    // callback
    app.get("/callback", (req: Request, res: Response, state: string) => {
        requestAccessToken(req, res, state);
    });
}
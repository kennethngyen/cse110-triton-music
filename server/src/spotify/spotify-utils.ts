import { Request, Response } from "express";
import { API_BASE_URL, SPOTIFY_AUTH_REDIRECT } from "../constants";
import querystring from "querystring";
import { generateRandomString } from "../misc/random-query";
import { updateRefreshTokenDB, getRefreshTokenDB } from "../misc/dbmodification";
import 'dotenv/config';

/**
 * authorization code flow
 * https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 * User grants permission once
 * ASSUME CLIENT SECRET CAN BE SAFELY STORED
 */
export function requestUserAuthorization(
    req: Request,
    res: Response,
    state: string
) {
    const client_id = process.env.CLIENT_ID as string;

    // state provides protection against "cross-site request forgery"
    // const state = generateRandomString(16);

    // scope is what the user is allowing us to access
    const scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library read";
    

    try {
        res.status(200).redirect(
            "https://accounts.spotify.com/authorize?" +
                querystring.stringify({
                    response_type: "code",
                    client_id: client_id,
                    scope: scope,
                    redirect_uri: SPOTIFY_AUTH_REDIRECT,
                    state: state,
                })
        );
    } catch (error) {
        res.status(400).send({ error: "Could not request authorization" });
    }
}

/**
 * "If the user accepted your request, then your app is ready to exchange the authorization code for an access token. It can do this by sending a POST request to the /api/token endpoint."
 */
export async function requestAccessToken(
    req: Request,
    res: Response,
    state: string
) {
    const code = req.query.code; // could be undefined
    const state_ = req.query.state; // could be undefined
    const err = req.query.error;

    if (!state_) {
        return res
            .status(400)
            .send({ error: "Could not request access token" });
    }
    if (!code) {
        return res.status(400).send({ error: "" + err });
    }
    if (state_ != state) {
        return res
            .status(400)
            .send({ error: "security threat; please try again" });
    }

    // now try using the auth code to fetch the access token
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + (Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")),
        },
        body: new URLSearchParams({
            code: code as string,
            redirect_uri: SPOTIFY_AUTH_REDIRECT,
            grant_type: "authorization_code",
        }).toString(),
    });

    if (!response.ok) {
        return res.status(400).send({ error: "Unable to fetch access token" });
    }

    /**
     * We expect the successful response to have:
     * access_token:  
     * token_type:  always "Bearer"
     * scope:
     * expires_in:   (seconds)
     * refresh_token:   <--- TODO: use this to keep getting new access tokens
     */

    const jsonResponse = await response.json();
    const accessToken = jsonResponse.access_token;
    const refreshToken = jsonResponse.refresh_token;

    //console.log(accessToken);
    //console.log(refreshToken);
    // TODO, store the access_token and refresh_token in the database:
    // in progress
    await updateRefreshTokenDB(process.env.EMAIL as string, refreshToken);


    res.status(200).send({"access_token": accessToken, "refresh_token": refreshToken});
}

export async function refreshAccessToken(refresh_token: string):Promise<string>{
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + (Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")),
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token
        }).toString(),
    });

    if (!response.ok) {
        return "";
    }

    /**
     * We expect the successful response to have:
     * access_token:  
     * token_type:  always "Bearer"
     * scope:
     * expires_in:   (seconds)
     * refresh_token:   <--- TODO: use this to keep getting new access tokens
     */

    const jsonResponse = await response.json();
    const accessToken = jsonResponse.access_token;
    const refreshToken = jsonResponse.refresh_token;

    if (!refreshToken) {
        return accessToken;
    }


    await updateRefreshTokenDB(process.env.EMAIL as string, refreshToken);
    return accessToken;
}

export async function requestUserInfo (req: Request, res: Response) {
    const urlParam = req.query.url as string;
    const decodedURL = decodeURIComponent(urlParam);

    try {
        // Try to create a new URL object
        new URL(decodedURL);
         // If no error is thrown, it's a valid URL
    } catch (error) {
        return res.status(400).send({ error: "not a valid URL" });  
        // If an error is thrown, it's not a valid URL
    }

    /* TODO
    code to get access token from some storage
     */
    //const accessToken = process.env.ACCESS_TOKEN as string;
    const refreshToken = await getRefreshTokenDB(process.env.EMAIL as string);
    const accessToken = await refreshAccessToken(refreshToken);
    if (accessToken == "") {
        return res.status(400).send({ error: "error getting access" });
    }

    const response = await fetch(decodedURL, {
        headers: {
            "Authorization": "Bearer " + accessToken,
        },
    });
    const jsonResponse = await response.json();

    console.log(jsonResponse);

    res.status(200).send(jsonResponse);
}

import {
    createFeedItem,
    getFeed,
    getFriendFeed,
} from "./feed-utils";
import { Request, Response } from "express";

export function createFeedEndpoints(app: any, feedItems: any, users: any) {
    // Create a new feed item
    app.post("/feed", (req: Request, res: Response) => {
        createFeedItem(req, res, feedItems);
    });

    // Delete a feed item
    /*
    app.delete("/feed/:id", (req: Request, res: Response) => {
        deleteFeedItem(req, res, feedItems);
    });
    */

    // Get all feed items
    app.get("/feed", (req: Request, res: Response) => {
        getFeed(req, res, feedItems);
    });

    // Get all feed items for just the client's friends
    app.get("/feed/:userID", (req: Request, res: Response) => {
        getFriendFeed(req, res, feedItems, users);
    });
}

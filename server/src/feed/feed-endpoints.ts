import { Request, Response } from "express";
import { authenticateToken } from "../verification/auth-utils";
import { createFeedItem } from "./feed-utils";
import { events, followingTable } from "../db/schema"; // Use the correct schema imports
import { db } from "../db/db";
import { eq, inArray } from "drizzle-orm";

export function createFeedEndpoints(app: any) {
    // Validate that `app` is an Express instance
    if (!app || typeof app.post !== "function" || typeof app.get !== "function") {
        throw new Error("Invalid app instance passed to createFeedEndpoints.");
    }

    // Create a new feed item
    app.post("/feed", authenticateToken, async (req: Request, res: Response) => {
        createFeedItem(req, res);
    });

    // Get feed items from followees and self
    app.get("/feed", authenticateToken, async (req: Request, res: Response) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ success: false, error: "Unauthorized: User information missing" });
        }

        try {
            // Fetch the list of followees
            const followees = await db
                .select({ followeeId: followingTable.followee })
                .from(followingTable)
                .where(eq(followingTable.follower, user.id));

            const followeeIds = followees.map((f) => f.followeeId);

            // Include the current user's posts
            followeeIds.push(user.id);

            // Retrieve feed items from followees and self
            const feedItems = await db
                .select({
                    id: events.id,
                    spotifyId: events.spotifyId,
                    description: events.description,
                    date: events.date,
                })
                .from(events)
                .where(inArray(events.id, followeeIds)); // Use followee IDs to filter posts

            res.status(200).json({ success: true, data: feedItems });
        } catch (error) {
            console.error("Error fetching feed items:", error);
            res.status(500).json({ success: false, error: "An error occurred while fetching the feed" });
        }
    });
}

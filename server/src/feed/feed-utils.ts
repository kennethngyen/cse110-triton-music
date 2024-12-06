import { Request, Response } from "express";
import { events } from "../db/schema"; // Use the events table for feed data
import { db } from "../db/db";

/**
 * Create a new feed item in the events table.
 */
export async function createFeedItem(req: Request, res: Response) {
    const user = (req as any).user; // Extract user info from authentication middleware

    if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized: User information missing" });
    }

    const { spotifyId, description, songname } = req.body;

    if (!spotifyId || !description || !songname) {
        return res.status(400).json({ error: "Missing required fields: spotifyId or description" });
    }

    const id = user.id;
    const username = user.email;

    const newFeedItem = {
        id,
        spotifyId,
        description,
        date: new Date(), // Use a `Date` object to satisfy the type requirement
        username,
        songname,
    };

    try {
        const insertedItem = await db
            .insert(events)
            .values(newFeedItem)
            .returning({
                id: events.id,
                spotifyId: events.spotifyId,
                description: events.description,
                date: events.date,
                username: events.username,
                songname: events.songname,
            }); // Explicitly specify fields to return

        res.status(201).json({ success: true, data: insertedItem[0] });
    } catch (error) {
        console.error("Error creating feed item:", error);
        res.status(500).json({ success: false, error: "An error occurred while creating the feed item" });
    }
}

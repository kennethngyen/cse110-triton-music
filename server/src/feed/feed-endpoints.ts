import { Request, Response } from "express";
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

// Connect to Turso using createClient
const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_API_KEY || '', // Use 'authToken' if required by the client
});

export function createFeedEndpoints(app: any) {
    // Create a new feed item
    app.post("/postToFeed", async (req: Request, res: Response) => {
        const { userId, description, spotifySongId, time } = req.body;

        if (!userId || !description || !spotifySongId || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            // Insert the post into the Turso database
            await tursoClient.execute(`
                INSERT INTO feed (userId, description, spotifySongId, time)
                VALUES (?, ?, ?, ?)
            `, [userId, description, spotifySongId, new Date(time).toISOString()]);

            res.status(201).json({ message: 'Post created successfully' });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Failed to create post' });
        }
    });

    // Get all feed items
    app.get("/getFeed", async (req: Request, res: Response) => {
        try {
            // Retrieve the feed data from the Turso database
            const result = await tursoClient.execute(`
                SELECT * FROM feed ORDER BY time DESC
            `);

            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error retrieving feed items:', error);
            res.status(500).json({ error: 'Failed to retrieve feed' });
        }
    });
}

import { followingTable, usersTable } from './../db/schema';
import { authenticateToken } from "../verification/auth-utils";
import { Response, Request } from "express";
import { and, eq } from 'drizzle-orm';
import { db } from "../db/db";

export function createFollowingEndpoints(app: any) {
    app.post('/follow', authenticateToken, async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (!user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }

            const { follower, followee } = req.body;
            console.log(followee, follower);
            if (!follower || !followee) {
                return res.status(400).json({ success: false, error: 'Follower and followee IDs are required' });
            }

            await db.insert(followingTable).values({ follower, followee });

            res.status(201).json({ success: true, message: 'Follow relationship added' });
        } catch (error) {
            console.error('Error adding follow relationship:', error);
            res.status(500).json({ success: false, error: 'An error occurred' });
        }
    });

    app.get('/get-following', authenticateToken, async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (!user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }

            const data = await db
            .select({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
            })
            .from(followingTable)
            .innerJoin(usersTable, eq(followingTable.followee, usersTable.id))
            .where(eq(followingTable.follower, user.id));


            res.status(201).json({ success: true, data: data });
        } catch (error) {
            console.error('Error adding follow relationship:', error);
            res.status(500).json({ success: false, error: 'An error occurred' });
        }
    });

    app.post('/unfollow', authenticateToken, async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const { followee } = req.body;
    
            if (!user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
    
            if (!followee) {
                return res.status(400).json({ success: false, error: 'Followee ID is required' });
            }
        
            await db
                .delete(followingTable)
                .where(
                    and(
                        eq(followingTable.followee, followee),
                        eq(followingTable.follower, user.id)
                    )
                );
    
            res.status(200).json({ success: true, message: 'Unfollowed successfully' });
        } catch (error) {
            console.error('Error unfollowing:', error);
            res.status(500).json({ success: false, error: 'An error occurred while unfollowing' });
        }
    });    
}

import { usersTable } from './../db/schema';
import { Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../db/db';

export function createUserEndpoints(app: any) {
    // Get all users
    app.get('/users', async (req: Request, res: Response) => {
        try {
            const users = await db.select().from(usersTable);
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ success: false, error: 'An error occurred' });
        }
    });

    // Search users by username
    app.get('/users/search', async (req: Request, res: Response) => {
        try {
            const { username } = req.body;
            
            // Validate username query parameter
            if (!username || typeof username !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Valid username query parameter is required' 
                });
            }

            // Perform case-insensitive search using SQL template literal
            const users = await db
                .select()
                .from(usersTable)
                .where(
                    sql`lower(${usersTable.email}) LIKE lower('%' || ${username} || '%')`
                );

            res.status(200).json({ 
                success: true, 
                data: users,
                count: users.length
            });
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ success: false, error: 'An error occurred' });
        }
    });
}
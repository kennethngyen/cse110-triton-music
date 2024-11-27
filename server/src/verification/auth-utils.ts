// auth-utils.ts
import bcrypt from 'bcrypt';
import { db } from '../db/db';
import { auth} from '../db/schema'; // Import 'users' table
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { registerUser, loginUser } from '../verification/auth';
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

export async function registerUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  const result = await registerUser(email, password);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({ message: 'User registered successfully!' });
}

export async function loginUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await loginUser(email, password);

  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.status(200).json({ user: result.user, token: result.token });
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authorization token required' });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string; email: string };

    // Fetch the user from the database using the ID from the token
    const authUser = await db
      .select()
      .from(auth)
      .where(eq(auth.id, decodedToken.id))
      .get();

    if (!authUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Attach user data to the request object
    (req as any).user = { id: authUser.id, email: authUser.email };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

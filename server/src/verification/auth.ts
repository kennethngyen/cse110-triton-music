// auth.ts
import bcrypt from 'bcrypt';
import { db } from '../db/db';
import { auth} from '../db/schema'; // Import 'users' table
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

// Function to register a new user
export async function registerUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the user already exists in 'auth' table
    const existingAuthUser = await db
      .select()
      .from(auth)
      .where(eq(auth.email, email))
      .get();

    if (existingAuthUser) {
      return { success: false, error: 'User with this email already exists.' };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert into 'auth' table
    await db.insert(auth).values({
      email: email,
      passwordHash: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Unable to register user. Please try again later.' };
  }
}

// Function to login a user
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: object; token?: string; error?: string }> {
  try {
    // Retrieve the user
    const authUser = await db
      .select()
      .from(auth)
      .where(eq(auth.email, email))
      .get();

    if (!authUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, authUser.passwordHash);

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: authUser.id, email: authUser.email }, // Payload
      SECRET_KEY, // Secret key
      { expiresIn: '1h' } // Options
    );

    // Exclude passwordHash from returned user details
    const { passwordHash, ...authUserWithoutPassword } = authUser;

    return { success: true, user: authUserWithoutPassword, token };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, error: 'Unable to login. Please try again later.' };
  }
}

// const authenticateToken = async (req: Request, res: Response, next: Function) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"

//   if (!token) {
//     return res.status(401).json({ success: false, error: 'Authorization token required' });
//   }

//   try {
//     // Verify the token
//     const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string; email: string };

//     // Check if the user exists in the database
//     const authUser = await db.select().from(auth).where(eq(auth.id, decodedToken.id)).get();

//     if (!authUser) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     // Attach the user data to the request
//     (req as any).user = { id: authUser.id, email: authUser.email };
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return res.status(403).json({ success: false, error: 'Invalid or expired token' });
//   }
// };

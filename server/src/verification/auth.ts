// auth.ts
import bcrypt from 'bcrypt';
import { db } from '../db/db';
import { auth, usersTable } from '../db/schema'; // Import 'users' table
import { eq } from 'drizzle-orm';

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
export async function loginUser(email: string, password: string) {
  try {
    // Retrieve the user from the 'auth' table
    const authUser = await db
      .select()
      .from(auth)
      .where(eq(auth.email, email))
      .get();

    if (!authUser) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, authUser.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Retrieve the user's profile from the 'users' table
    const userProfile = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, authUser.id))
      .get();

    if (!userProfile) {
      throw new Error('User profile not found.');
    }

    // Combine authUser and userProfile (excluding passwordHash)
    const { passwordHash, ...authUserWithoutPassword } = authUser;
    const user = {
      ...authUserWithoutPassword,
      ...userProfile,
    };

    return user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Unable to login. Please try again later.');
  }
}
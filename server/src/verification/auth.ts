// auth.ts
import bcrypt from 'bcrypt';
import { db } from '../db/db';
import { auth, usersTable } from '../db/schema'; // Import 'users' table
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // UUID library for generating unique IDs

// Function to register a new user
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Check if the user already exists in 'auth' table
    const existingAuthUser = await db
      .select()
      .from(auth)
      .where(eq(auth.email, email))
      .get();

    // Check if the user already exists in 'users' table
    const existingProfileUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    if (existingAuthUser || existingProfileUser) {
      throw new Error('User with this email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a unique ID for the user
    const userId = uuidv4();

    // Insert into 'auth' table
    await db.insert(auth).values({
      email: email,
      passwordHash: hashedPassword,
    });

    // Insert into 'users' table
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: name,
        email: email,
      })
      .returning({
        name: usersTable.name,
        email: usersTable.email,
      });

    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Unable to register user. Please try again later.');
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

    // Compare the provided password with the stored hash
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
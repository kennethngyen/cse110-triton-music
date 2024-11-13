// auth.ts
import bcrypt from 'bcrypt';
import { db } from '../db/db';
import { auth } from '../db/schema';
import { eq } from 'drizzle-orm';

// Function to register a new user
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(auth)
      .where(eq(auth.email, email))
      .get();
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const [newUser] = await db
      .insert(auth)
      .values({
        email: email,
        password: hashedPassword,
      })
      .returning({
        id: auth.id,
        email: auth.email,
      });

    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Unable to register user. Please try again later.');
  }
}

// Function to login a user
export async function loginUser(email: string, password: string) {
  // Retrieve the user from the database
  const user = await db
    .select()
    .from(auth)
    .where(eq(auth.email, email))
    .get();

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare the provided password with the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return user;
}

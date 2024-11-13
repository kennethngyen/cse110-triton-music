// auth.ts
import bcrypt from 'bcrypt';
import { db, usersTable } from '../db/db';
import { eq } from 'drizzle-orm';

// Function to register a new user
export async function registerUser(name: string, email: string, password: string) {
  // Check if the user already exists
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .get();

  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create the new user
  const [newUser] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      passwordHash,
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    });

  return newUser;
}

// Function to login a user
export async function loginUser(email: string, password: string) {
  // Retrieve the user from the database
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .get();

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare the provided password with the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return user;
}

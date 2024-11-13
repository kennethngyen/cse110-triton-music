// auth-utils.ts
import { Request, Response } from 'express';
import { registerUser, loginUser } from '../verification/auth';

export async function registerUserHandler(req: Request, res: Response) {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const newUser = await registerUser(name, email, password);
    res.status(201).send({
      message: 'User registered successfully.',
      user: newUser,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).send({ error: error.message || 'Registration failed.' });
  }
}

export async function loginUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const user = await loginUser(email, password);
    // Exclude passwordHash from the response
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).send({
      message: 'Login successful.',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).send({ error: error.message || 'Login failed.' });
  }
}

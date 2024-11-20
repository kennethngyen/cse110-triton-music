// auth-utils.ts
import { Request, Response } from 'express';
import { registerUser, loginUser } from '../verification/auth';

export async function registerUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const result = await registerUser(email, password);

    if (result.success) {
      return res.status(201).send({
        message: 'User registered successfully.',
      });
    }

    // Handle specific error from `registerUser`
    return res.status(400).send({ error: result.error });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ error: 'Registration failed.' });
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
    res.status(200).send({
      message: 'Login successful.',
      user: user,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).send({ error: error.message || 'Login failed.' });
  }
}
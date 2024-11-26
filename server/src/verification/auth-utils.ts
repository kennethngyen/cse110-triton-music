// auth-utils.ts
import { Request, Response } from 'express';
import { registerUser, loginUser } from '../verification/auth';

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
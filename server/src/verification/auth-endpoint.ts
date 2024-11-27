// auth-endpoints.ts
import { Request, Response } from 'express';
import { registerUserHandler, loginUserHandler } from './auth-utils';

export function createAuthEndpoints(app: any) {
  // Register a new user
  app.post('/register', (req: Request, res: Response) => {
    registerUserHandler(req, res);
  });

  // Login a user
  app.post('/login', (req: Request, res: Response) => {
    loginUserHandler(req, res);
  });
}
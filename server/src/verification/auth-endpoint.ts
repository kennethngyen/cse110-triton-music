// auth-endpoints.ts
import { Request, Response } from 'express';
import { registerUserHandler, loginUserHandler, authenticateToken } from './auth-utils';

export function createAuthEndpoints(app: any) {
  // Register a new user
  app.post('/register', (req: Request, res: Response) => {
    registerUserHandler(req, res);
  });

  // Login a user
  app.post('/login', (req: Request, res: Response) => {
    loginUserHandler(req, res);
  });

  app.get('/token-user-id', authenticateToken, (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user){
        throw new Error();
      }
      
      res.status(200).json({ success: true, user: user });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ success: false, error: 'An error occurred' });
    }
  });

}
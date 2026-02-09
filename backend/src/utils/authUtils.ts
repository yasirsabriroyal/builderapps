import { Response } from 'express';
import { AuthRequest, AuthenticatedUser } from '../middleware/auth';

export const requireAuth = (req: AuthRequest, res: Response): AuthenticatedUser | null => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    return null;
  }
  return req.user;
};

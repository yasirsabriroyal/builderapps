import { AppError } from '../middleware/errorHandler';
import { AuthRequest, AuthenticatedUser } from '../middleware/auth';

export const requireAuth = (req: AuthRequest): AuthenticatedUser => {
  if (!req.user) {
    throw new AppError('Unauthorized: User not authenticated', 401);
  }
  return req.user;
};

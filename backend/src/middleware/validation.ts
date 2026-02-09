import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw new AppError('Please provide all required fields', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Please provide a valid email', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  next();
};

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError('Please provide a project name', 400);
  }

  next();
};

export const validateMaterial = (req: Request, res: Response, next: NextFunction) => {
  const { materialId, quantity } = req.body;

  if (!materialId || !quantity) {
    throw new AppError('Please provide materialId and quantity', 400);
  }

  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  next();
};

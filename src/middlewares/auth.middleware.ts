import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../modules/users/user.model';
import { JWT_SECRET } from '../shared/utils/jwtUtils';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface TokenPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'Token missing' });
      return;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({ message: 'Invalid authorization format' });
      return;
    }

    if (!JWT_SECRET) {
      res.status(500).json({ message: 'JWT secret is not defined' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const user = await UserModel.findById(decoded.sub, '_id');
    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    req.userId = decoded.sub;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    console.error('Authentication error: ', error);
    res.status(500).json({ message: 'Server error during authentication' });
    return;
  }
}

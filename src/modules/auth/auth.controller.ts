import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.types';
import { ErrorHandler } from '../../shared/errors/error';
import { HttpErrorsStatusCode } from '../../shared/errors/error.types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password }: RegisterDTO = req.body;
      const result = await AuthService.register({ email, password });
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(HttpErrorsStatusCode.INTERNAL_SERVER).json({
        message: 'Internal server error',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginDTO = req.body;
      const result = await AuthService.login({ email, password });
      return res.json(result);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(HttpErrorsStatusCode.INTERNAL_SERVER).json({
        message: 'Internal server error',
      });
    }
  }
}

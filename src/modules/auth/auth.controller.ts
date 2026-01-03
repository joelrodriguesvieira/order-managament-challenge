import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.types';
import { ErrorHandler } from '../../shared/errors/error';
import { HttpErrorsStatusCode } from '../../shared/errors/error.types';
import { loginSchema, registerSchema } from './auth.schema';
import { ZodError } from 'zod';
import { formatZodError } from '../../shared/errors/zodErrorFormatter';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      const { email, password }: RegisterDTO = data;
      const result = await AuthService.register({ email, password });
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HttpErrorsStatusCode.BAD_REQUEST).json({
          errors: formatZodError(error),
        });
      }
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
      const data = loginSchema.parse(req.body);
      const { email, password }: LoginDTO = data;
      const result = await AuthService.login({ email, password });
      return res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HttpErrorsStatusCode.BAD_REQUEST).json({
          errors: formatZodError(error),
        });
      }
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(HttpErrorsStatusCode.INTERNAL_SERVER).json({
        message: 'Internal server error',
      });
    }
  }
}

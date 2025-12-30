import { ErrorHandler } from '../../shared/errors/error';
import { HttpErrorsStatusCode } from '../../shared/errors/error.types';
import { JWT_SECRET } from '../../shared/utils/jwtUtils';
import { UserModel } from '../users/user.model';
import { RegisterDTO, LoginDTO } from './auth.types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async register({ email, password }: RegisterDTO) {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      throw new ErrorHandler(
        'User already exists',
        HttpErrorsStatusCode.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
      expiresIn: '12h',
    });

    return { token };
  }

  static async login({ email, password }: LoginDTO) {
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      throw new ErrorHandler(
        'Invalid credentials',
        HttpErrorsStatusCode.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ErrorHandler(
        'Invalid credentials',
        HttpErrorsStatusCode.UNAUTHORIZED,
      );
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
      expiresIn: '12h',
    });

    return { token };
  }
}

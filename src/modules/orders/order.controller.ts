import { Request, Response } from 'express';
import { ErrorHandler } from '../../shared/errors/error';
import { OrderService } from './order.service';
import { HttpErrorsStatusCode } from '../../shared/errors/error.types';

export class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const order = await OrderService.create(req.body);
      return res.status(201).json(order);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res
        .status(HttpErrorsStatusCode.INTERNAL_SERVER)
        .json({ message: 'Internal server error' });
    }
  }
}

import { Request, Response } from 'express';
import { ErrorHandler } from '../../shared/errors/error';
import { OrderService } from './order.service';
import { HttpErrorsStatusCode } from '../../shared/errors/error.types';
import { CreateOrderDTO, ListOrdersQuery } from './order.types';

export class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const data: CreateOrderDTO = req.body;
      const order = await OrderService.create(data);
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

  static async list(req: Request, res: Response) {
    try {
      const query = req.query as ListOrdersQuery;
      const result = await OrderService.list(query);
      return res.status(200).json(result);
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

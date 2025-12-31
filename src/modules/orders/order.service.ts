import { ErrorHandler } from '../../shared/errors/error';
import { HttpErrorsStatusCode } from '../../shared/errors/error.types';
import { CreateOrderDTO, ListOrdersQuery } from './order.dto';
import { OrderState, OrderStatus } from './order.enum';
import { OrderModel } from './order.model';

export class OrderService {
  static async create(data: CreateOrderDTO) {
    if (!data.services || data.services.length === 0) {
      throw new ErrorHandler(
        'Order must be at least one service',
        HttpErrorsStatusCode.BAD_REQUEST,
      );
    }

    const totalValue = data.services.reduce(
      (sum, service) => sum + service.value,
      0,
    );

    if (totalValue <= 0) {
      throw new ErrorHandler(
        'Total service value must be greater than zero',
        HttpErrorsStatusCode.BAD_REQUEST,
      );
    }

    return OrderModel.create({
      ...data,
      state: OrderState.CREATED,
      status: OrderStatus.ACTIVE,
    });
  }

  static async list({
    page = 1,
    limit = 10,
    state = OrderState.CREATED,
  }: ListOrdersQuery) {
    const orders = await OrderModel.find({ state })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await OrderModel.countDocuments({ state });

    return {
      data: orders,
      page,
      limit,
      total,
    };
  }
}

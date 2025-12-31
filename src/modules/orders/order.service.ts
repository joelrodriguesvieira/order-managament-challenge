import { ErrorHandler } from '../../shared/errors/error';
import { HttpErrorsStatusCode } from '../../shared/errors/error.types';
import {
  AdvanceOrdersParams,
  CreateOrderDTO,
  ListOrdersQuery,
} from './order.types';
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

  static async advance(orderId: AdvanceOrdersParams) {
    if (!orderId) {
      throw new ErrorHandler(
        'Provide the order id',
        HttpErrorsStatusCode.BAD_REQUEST,
      );
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new ErrorHandler(
        'Order not found. Check the id or try another',
        HttpErrorsStatusCode.NOT_FOUND,
      );
    }

    const transitions: Record<OrderState, OrderState | null> = {
      CREATED: OrderState.ANALYSIS,
      ANALYSIS: OrderState.COMPLETED,
      COMPLETED: null,
    };

    const newOrderState = transitions[order.state as OrderState];

    if (!newOrderState) {
      throw new ErrorHandler(
        'Order is already completed and cannot advance',
        HttpErrorsStatusCode.BAD_REQUEST,
      );
    }

    order.state = newOrderState;
    await order.save();
    return order;
  }
}

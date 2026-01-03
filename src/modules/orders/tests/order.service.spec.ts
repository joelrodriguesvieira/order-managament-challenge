import { vi, describe, beforeEach, it, expect } from 'vitest';
import { OrderState } from '../order.enum';
import { OrderModel } from '../order.model';
import { OrderService } from '../order.service';
import { AdvanceOrdersParams } from '../order.types';
import { HttpErrorsStatusCode } from '../../../shared/errors/error.types';

vi.mock('../order.model');

describe('Order service - Advance Method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(`Should advance from 'CREATED' to 'ANALYSIS'`, async () => {
    const orderMock = {
      state: OrderState.CREATED,
      save: vi.fn(),
    };

    vi.spyOn(OrderModel, 'findById').mockResolvedValue(orderMock);

    const orderId = 'order-id' as unknown as AdvanceOrdersParams;
    const newState = OrderState.ANALYSIS;
    const result = await OrderService.advance(orderId, newState);

    expect(result.state).toBe(OrderState.ANALYSIS);
    expect(orderMock.save).toHaveBeenCalled();
  });

  it(`Should advance from 'ANALYSIS' to 'COMPLETED'`, async () => {
    const orderMock = {
      state: OrderState.ANALYSIS,
      save: vi.fn(),
    };

    vi.spyOn(OrderModel, 'findById').mockResolvedValue(orderMock);

    const orderId = 'order-id' as unknown as AdvanceOrdersParams;
    const newState = OrderState.COMPLETED;
    const result = await OrderService.advance(orderId, newState);

    expect(result.state).toBe(OrderState.COMPLETED);
    expect(orderMock.save).toHaveBeenCalled();
  });

  it(`Should throw 'BAD REQUEST' when trying to advance from 'CREATED' to 'COMPLETED' state`, async () => {
    const orderMock = {
      state: OrderState.CREATED,
      save: vi.fn(),
    };

    vi.spyOn(OrderModel, 'findById').mockResolvedValue(orderMock);

    const newState = OrderState.COMPLETED;

    await expect(
      OrderService.advance('order-id' as unknown as AdvanceOrdersParams, newState),
    ).rejects.toMatchObject({
      message: 'Invalid state transition from CREATED to COMPLETED',
      statusCode: HttpErrorsStatusCode.BAD_REQUEST,
    });
  });

  it(`Should throw 'BAD REQUEST' when trying to retreat from 'ANALYSIS' to 'CREATED' state`, async () => {
    const orderMock = {
      state: OrderState.ANALYSIS,
      save: vi.fn(),
    };

    vi.spyOn(OrderModel, 'findById').mockResolvedValue(orderMock);
    const newState = OrderState.CREATED;

    await expect(
      OrderService.advance('order-id' as unknown as AdvanceOrdersParams, newState),
    ).rejects.toMatchObject({
      message: 'Invalid state transition from ANALYSIS to CREATED',
      statusCode: HttpErrorsStatusCode.BAD_REQUEST,
    });
  });

  it(`Should throw 'NOT FOUND' if order is not found`, async () => {
    vi.spyOn(OrderModel, 'findById').mockResolvedValue(null);

    const invalidOrderId = 'order-id' as unknown as AdvanceOrdersParams;
    const newState = OrderState.ANALYSIS;

    await expect(
      OrderService.advance(invalidOrderId, newState),
    ).rejects.toMatchObject({
      message: 'Order not found. Check the id or try another',
      statusCode: HttpErrorsStatusCode.NOT_FOUND,
    });
  });

  it(`Should throw 'BAD REQUEST' if id is missing`, async () => {
    await expect(
      OrderService.advance(undefined as any, OrderState.ANALYSIS),
    ).rejects.toMatchObject({
      message: 'Provide the order id',
      statusCode: HttpErrorsStatusCode.BAD_REQUEST,
    });
  });
});

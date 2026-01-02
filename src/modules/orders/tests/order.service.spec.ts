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

  it('Should advance from CREATED to ANALYSIS', async () => {
    const orderMock = {
      state: OrderState.CREATED,
      save: vi.fn(),
    };

    vi.spyOn(OrderModel, 'findById').mockResolvedValue(orderMock);

    const orderId = 'order-id' as unknown as AdvanceOrdersParams;
    const result = await OrderService.advance(orderId);

    expect(result.state).toBe(OrderState.ANALYSIS);
    expect(orderMock.save).toHaveBeenCalled();
  });

  it('Should advance from ANALYSIS to COMPLETED', async () => {
    const orderMock = {
      state: OrderState.ANALYSIS,
      save: vi.fn(),
    };

    vi.spyOn(OrderModel, 'findById').mockResolvedValue(orderMock);

    const orderId = 'order-id' as unknown as AdvanceOrdersParams;
    const result = await OrderService.advance(orderId);

    expect(result.state).toBe(OrderState.COMPLETED);
    expect(orderMock.save).toHaveBeenCalled();
  });

  it('Should throw BAD_REQUEST if order is COMPLETED', async () => {
    const orderMock = {
      state: OrderState.COMPLETED,
      save: vi.fn(),
    };

    vi.spyOn(OrderModel, 'findById').mockResolvedValue(orderMock);

    const orderId = 'order-id' as unknown as AdvanceOrdersParams;

    await expect(OrderService.advance(orderId)).rejects.toMatchObject({
      message: 'Order is already completed and cannot advance',
      statusCode: HttpErrorsStatusCode.BAD_REQUEST,
    });
  });

  it('Should throw NOT_FOUND if order is not found', async () => {
    vi.spyOn(OrderModel, 'findById').mockResolvedValue(null);

    const invalidOrderId = 'order-id' as unknown as AdvanceOrdersParams;

    await expect(OrderService.advance(invalidOrderId)).rejects.toMatchObject({
      message: 'Order not found. Check the id or try another',
      statusCode: HttpErrorsStatusCode.NOT_FOUND,
    });
  });

  it('should throw BAD_REQUEST if orderId is missing', async () => {
    await expect(OrderService.advance(undefined as any)).rejects.toMatchObject({
      message: 'Provide the order id',
      statusCode: HttpErrorsStatusCode.BAD_REQUEST,
    });
  });
});

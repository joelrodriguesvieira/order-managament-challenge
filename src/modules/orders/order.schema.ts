import z from 'zod';
import { OrderState } from './order.enum';

export const createOrderSchema = z.object({
  lab: z.string().nonempty({ message: 'Lab is required' }),
  patient: z.string().nonempty({ message: 'Patient is required' }),
  customer: z.string().nonempty({ message: 'Customer is required' }),
  services: z
    .array(
      z.object({
        name: z.string().nonempty({ message: 'Service name is required' }),
        value: z
          .number()
          .positive({ message: 'The service fee must be greater than zero' }),
      }),
    )
    .min(1, { message: 'At least one service is required' }),
});

export const listOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 1))
    .refine((value) => value > 0, { message: 'page must be greater than 0' }),

  limit: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 10))
    .refine((value) => value > 0, { message: 'limit must be greater than 0' }),

  state: z.nativeEnum(OrderState).optional(),
});

export const advanceOrderParamsSchema = z.object({
  newState: z.nativeEnum(OrderState),
});

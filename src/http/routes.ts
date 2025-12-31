import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { orderRoutes } from '../modules/orders/order.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/orders', orderRoutes);

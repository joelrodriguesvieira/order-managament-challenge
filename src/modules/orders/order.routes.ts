import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { OrderController } from './order.controller';

export const orderRoutes = Router();

orderRoutes.use(ensureAuthenticated);

orderRoutes.post('/', OrderController.create);
orderRoutes.get('/', OrderController.list);
orderRoutes.patch('/:id/advance', OrderController.advance);
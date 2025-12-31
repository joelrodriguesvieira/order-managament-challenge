import { OrderServiceStatus, OrderState } from "./order.enum";

export interface OrderServiceDTO {
  name: string;
  value: number;
  status?: OrderServiceStatus;
}

export interface CreateOrderDTO {
  lab: string;
  patient: string;
  customer: string;
  services: OrderServiceDTO[];
}

export interface ListOrdersQuery {
  page?: number;
  limit?: number;
  state?: OrderState;
}

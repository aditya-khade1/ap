import { IOrder } from "@/types";
import { generateOrderNumber } from "@/lib/utils";

let orders: IOrder[] = [];

export function getOrders() {
  return [...orders].sort(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
  );
}

export function getOrderById(id: string) {
  return orders.find((o) => o._id === id) || null;
}

export function getOrdersByCustomer(customerId: string) {
  return orders
    .filter((o) => o.customer === customerId)
    .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
}

export function createOrder(data: Omit<IOrder, "_id" | "orderNumber" | "createdAt" | "updatedAt">) {
  const order: IOrder = {
    ...data,
    _id: String(orders.length + 1000),
    orderNumber: generateOrderNumber(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as IOrder;
  orders = [order, ...orders];
  return order;
}

export function updateOrder(id: string, data: Partial<IOrder>) {
  const idx = orders.findIndex((o) => o._id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...data, updatedAt: new Date() } as IOrder;
  return orders[idx];
}

export function getOrderStats() {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 5);
  return { totalOrders, totalRevenue, recentOrders };
}

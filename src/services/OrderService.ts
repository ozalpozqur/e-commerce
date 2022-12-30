import altogic from '../libs/altogic';
import { Order, OrderItem, PaginateData, Product } from '../types/altogic';
import useAuthStore from '../store/auth';

export const ORDER_LIMIT = 5;
export default class OrderService {
	static async getAllOrders(page: number = 1, limit: number = ORDER_LIMIT) {
		const {
			// @ts-ignore
			data: { data, info },
			errors
		} = await altogic.db
			.model('orders')
			.lookup({ field: 'user' })
			.sort('createdAt', 'desc')
			.page(page)
			.limit(limit)
			.get(true);

		if (errors) throw errors;

		return {
			orders: data as Order[],
			paginateData: info as PaginateData
		};
	}
	static async getOrders(page: number = 1, limit: number = ORDER_LIMIT) {
		const { user } = useAuthStore.getState();
		if (!user) throw new Error('Unauthorized');

		const {
			// @ts-ignore
			data: { data, info },
			errors
		} = await altogic.db
			.model('orders')
			.filter(`user == '${user._id}'`)
			.sort('createdAt', 'desc')
			.page(page)
			.limit(limit)
			.get(true);

		if (errors) throw errors;

		return {
			orders: data as Order[],
			paginateData: info as PaginateData
		};
	}

	static async getOrderById(id: string) {
		const { data, errors } = await altogic.db.model('orders').object(id).get();

		if (errors) throw errors;

		return data as Order;
	}

	static async updateOrder(id: string, data: Partial<Order>) {
		const { data: order, errors } = await altogic.db.model('orders').object(id).update(data);
		if (errors) throw errors;
		console.log(order);
		return order as Order;
	}

	static async getOrderDetails(orderId: string) {
		const { data, errors } = await altogic.db
			.model('orderItems')
			.filter(`order._id == '${orderId}'`)
			.lookup({ field: 'product' })
			.lookup({ field: 'order' })
			.get();

		if (errors) throw errors;

		return data as OrderItem[];
	}
}

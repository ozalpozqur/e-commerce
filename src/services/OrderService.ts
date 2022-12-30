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

	static async getOrderDetails(orderId: string) {
		const { data, errors } = await altogic.db
			.model('orderItems')
			.filter(`order == '${orderId}'`)
			.lookup({ field: 'product' })
			.get();

		if (errors) throw errors;

		return data as OrderItem[];
	}
}

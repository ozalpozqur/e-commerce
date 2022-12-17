import altogic from '../libs/altogic';
import { Order } from '../types/altogic';

export default class OrderService {
	static async getOrders(userId: string) {
		const { data, errors } = await altogic.db
			.model('orders')
			.filter(`user.id == '${userId}'`)
			.lookup({ field: 'user' })
			.lookup({ field: 'product' })
			.get();

		if (errors) throw errors;

		return data as Order[];
	}

	static async addToCart(data: object) {
		const { data: dataFromDB, errors } = await altogic.db.model('orders').create(data);

		if (errors) throw errors;

		return dataFromDB as Order;
	}
}

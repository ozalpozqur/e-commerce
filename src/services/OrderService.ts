import altogic from '../libs/altogic';
import { Order } from '../types/altogic';
import useAuthStore from '../store/auth';

export default class OrderService {
	static async getOrders() {
		const { user } = useAuthStore.getState();
		if (!user) return null;
		const { data, errors } = await altogic.db
			.model('orders')
			.filter(`user == '${user._id}'`)
			.sort('createdAt', 'desc')
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

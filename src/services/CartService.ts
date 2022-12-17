import altogic from '../libs/altogic';
import { Cart } from '../types/altogic';

export default class CartService {
	static async getCart(userId: string) {
		const { data, errors } = await altogic.db
			.model('cart')
			.filter(`user.id == '${userId}'`)
			.lookup({ field: 'user' })
			.lookup({ field: 'product' })
			.get();

		if (errors) throw errors;

		return data as Cart[];
	}

	static async addToCart(data: object) {
		const { data: dataFromDB, errors } = await altogic.db.model('cart').create(data);

		if (errors) throw errors;

		return dataFromDB as Cart;
	}
}

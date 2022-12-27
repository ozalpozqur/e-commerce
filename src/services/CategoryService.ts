import altogic, { altogicOnlyRead } from '../libs/altogic';
import { Category } from '../types/altogic';

export default class CategoryService {
	static async getCategories() {
		const { data, errors } = await altogicOnlyRead.db.model('categories').get();

		if (errors) throw errors;

		return data as Category[];
	}
	static async getActiveCategories() {
		const { data, errors } = await altogicOnlyRead.db
			.model('categories')
			.lookup({
				name: 'product',
				modelName: 'products',
				query: 'this._id == lookup.category'
			})
			.filter('EXISTS(product) && product.qtyInStock > 0')
			.get();

		if (errors) throw errors;

		return data as Category[];
	}

	static async addCategory(data: object) {
		const { data: dataFromDB, errors } = await altogic.db.model('categories').create(data);

		if (errors) throw errors;

		return dataFromDB as Category;
	}

	static async deleteCategory(id: string) {
		const { data, errors } = await altogic.db.model('categories').object(id).delete();

		if (errors) throw errors;

		return true;
	}
}

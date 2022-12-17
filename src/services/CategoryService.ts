import altogic from '../libs/altogic';
import { Category } from '../types/altogic';

export default class CategoryService {
	static async getCategories() {
		const { data, errors } = await altogic.db.model('categories').get();

		if (errors) throw errors;

		return data as Category[];
	}

	static async addCategory(data: object) {
		const { data: dataFromDB, errors } = await altogic.db.model('categories').create(data);

		if (errors) throw errors;

		return dataFromDB as Category;
	}
}

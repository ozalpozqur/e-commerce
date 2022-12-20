import altogic from '../libs/altogic';
import { Category, Product } from '../types/altogic';
import { APIError } from 'altogic';
import useCategoryStore from '../store/category';
import category from '../store/category';

export default class ProductService {
	static async getProducts() {
		const { data, errors } = await altogic.db
			.model('products')
			.sort('createdAt', 'desc')
			.lookup({ field: 'category' })
			.get();

		if (errors) throw errors;

		return data as Product[];
	}

	static async getProductsByCategory(slug: string) {
		const { data, errors } = await altogic.db
			.model('products')
			.sort('createdAt', 'desc')
			.filter(`category.slug == '${slug}'`)
			.lookup({ field: 'category' })
			.get();

		if (errors) throw errors;

		return data as Product[];
	}

	static async getProductById(_id: string) {
		const { data, errors } = await altogic.db.model('products').object(_id).get();

		if (errors) throw errors;

		return data as Product;
	}

	static async addProduct(product: AddProduct, image: File) {
		const { errors: uploadErrors, data } = await ProductService.uploadCoverImage(image);

		if (uploadErrors) throw uploadErrors;

		const { data: dataFromDB, errors } = (await altogic.endpoint.post('/products', {
			...product,
			coverURL: data.publicPath
		})) as {
			data: Product;
			errors: APIError;
		};

		if (errors) throw errors;

		dataFromDB.category = useCategoryStore
			.getState()
			.categories.find(category => category._id === product.category) as Category;

		return dataFromDB as Product;
	}

	static async uploadCoverImage(file: File) {
		let { data, errors } = (await altogic.storage.bucket('coverImages').upload(file.name, file, {
			isPublic: true,
			onProgress() {} // suppress for ts error
		})) as {
			data: {
				publicPath: string;
			};
			errors: APIError;
		};

		return {
			errors,
			data
		};
	}
}

interface AddProduct {
	name: string;
	qtyInStock: number;
	category: string;
	description: string;
	price: number;
}

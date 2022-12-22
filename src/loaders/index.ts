import ProductService from '../services/ProductService';
import CategoryService from '../services/CategoryService';
import CartService from '../services/CartService';
import useAuthStore from '../store/auth';
import { Product, Category, Cart } from '../types/altogic';

interface RootLoader {
	products: Product[];
	categories: Category[];
	cart: Cart[];
}
export async function rootLoader() {
	const products = ProductService.getProducts();
	const categories = CategoryService.getCategories();

	const data: RootLoader = {
		products: await products,
		categories: await categories,
		cart: useAuthStore.getState().user ? await CartService.getCart() : []
	};

	return data;
}

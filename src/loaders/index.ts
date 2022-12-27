import ProductService from '../services/ProductService';
import CategoryService from '../services/CategoryService';
import CartService from '../services/CartService';
import useAuthStore from '../store/auth';
import { Product, Category, Cart, User } from '../types/altogic';
import altogic from '../libs/altogic';
import { OrderService } from '../services';
import { LoaderFunction } from 'react-router-dom';

interface RootLoader {
	products: Product[];
	categories: Category[];
	activeCategories: Category[];
	cart: Cart[];
}
export async function rootLoader() {
	const products = ProductService.getProducts({ onlyHasStock: true });
	const activeCategories = CategoryService.getActiveCategories();
	const categories = CategoryService.getCategories();

	const data: RootLoader = {
		products: await products,
		categories: await categories,
		activeCategories: await activeCategories,
		cart: []
	};
	const { user, logout, setUser } = useAuthStore.getState();
	if (user) {
		data.cart = await CartService.getCart();
		const { user: userFromDB, errors } = await altogic.auth.getUserFromDB();
		if (!userFromDB || errors) logout();
		setUser(userFromDB as User);
	}

	return data;
}

export async function orderDetailLoader(orderId?: string) {
	if (!orderId) return;
	const orderDetails = await OrderService.getOrderDetails(orderId);
	if (orderDetails.length === 0) throw new Response('Not Found', { status: 404 });
	return orderDetails;
}

export async function productDetailLoader(productId?: string) {
	if (!productId) return;
	const product = await ProductService.getProductById(productId);
	if (!product) throw new Response('Not Found', { status: 404 });
	return product;
}

export async function getProductByCategoryLoader(slug?: string) {
	if (!slug) return;
	return await ProductService.getProductsByCategory(slug);
}

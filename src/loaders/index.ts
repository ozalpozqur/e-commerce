import ProductService, { PRODUCT_LIMIT } from '../services/ProductService';
import CategoryService from '../services/CategoryService';
import CartService from '../services/CartService';
import useAuthStore from '../store/auth';
import { Product, Category, Cart, User, Color, Size, PaginateData } from '../types/altogic';
import altogic from '../libs/altogic';
import { ColorService, OrderService, SizeService } from '../services';
import { sl } from 'date-fns/locale';
import product from '../store/product';

export async function rootLoader() {
	const searchParams = new URLSearchParams(location.search);
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	const products = ProductService.getProducts({ onlyHasStock: true, page, limit: PRODUCT_LIMIT });
	const activeCategories = CategoryService.getActiveCategories();
	const categories = CategoryService.getCategories();
	const colors = ColorService.getColors();
	const sizes = SizeService.getSizes();

	const data: RootLoader = {
		products: await products,
		categories: await categories,
		activeCategories: await activeCategories,
		colors: await colors,
		sizes: await sizes,
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

	const variants = await ProductService.getProductsByVariantId(product.variantId);

	return { product, variants };
}
export async function productDetailLoaderForEdit(productId?: string) {
	if (!productId) return;
	const product = await ProductService.getProductById(productId);
	if (!product) throw new Response('Not Found', { status: 404 });
	return product;
}
export async function getProductByCategoryLoader(slug?: string) {
	if (!slug) return;

	const searchParams = new URLSearchParams(location.search);
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	return ProductService.getProductsByCategory(slug, { onlyHasStock: true, page, limit: PRODUCT_LIMIT });
}
export interface RootLoader {
	products: {
		items: Product[];
		paginateData: PaginateData;
	};
	categories: Category[];
	activeCategories: Category[];
	colors: Color[];
	cart: Cart[];
	sizes: Size[];
}

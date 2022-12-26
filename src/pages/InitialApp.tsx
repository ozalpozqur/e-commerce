import { Outlet, useLoaderData } from 'react-router-dom';
import { Cart, Category, Product } from '../types/altogic';
import { useEffect } from 'react';
import useProductStore from '../store/product';
import useCategoryStore from '../store/category';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';
import altogic from '../libs/altogic';
import CartService from '../services/CartService';

interface LoaderData {
	products: Product[];
	categories: Category[];
	activeCategories: Category[];
	cart: Cart[];
}
export default function InitialApp() {
	const { products, categories, cart, activeCategories } = useLoaderData() as LoaderData;
	const { setProducts } = useProductStore();
	const { setCategories, setActiveCategories } = useCategoryStore();
	const { setCart } = useCartStore();
	const { user } = useAuthStore();

	useEffect(() => {
		setProducts(products);
		setCategories(categories);
		setActiveCategories(activeCategories);
		if (cart) setCart(cart);

		if (user) {
			altogic.realtime.join(user?._id);
			altogic.realtime.on('cleared-cart', clearCart);
			altogic.realtime.on('fetch-cart', fetchCart);
		}

		return () => {
			altogic.realtime.off('cleared-cart', clearCart);
			altogic.realtime.off('fetch-cart', fetchCart);
		};
	}, []);

	function clearCart() {
		setCart([]);
	}

	async function fetchCart() {
		setCart(await CartService.getCart());
	}

	return <Outlet />;
}

import { Outlet, useLoaderData } from 'react-router-dom';
import { Cart, Category, Product } from '../types/altogic';
import { useEffect } from 'react';
import useProductStore from '../store/product';
import useCategoryStore from '../store/category';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';
import altogic from '../libs/altogic';

interface LoaderData {
	products: Product[];
	categories: Category[];
	cart: Cart[];
}
export default function InitialApp() {
	const { products, categories, cart } = useLoaderData() as LoaderData;
	const { setProducts } = useProductStore();
	const { setCategories } = useCategoryStore();
	const { setCart } = useCartStore();
	const { user } = useAuthStore();

	useEffect(() => {
		setProducts(products);
		setCategories(categories);
		if (cart) setCart(cart);

		if (user) {
			altogic.realtime.join(user?._id);
			altogic.realtime.on('cleared-cart', clearCart);
		}

		return () => {
			altogic.realtime.off('cleared-cart', clearCart);
		};
	}, []);

	function clearCart() {
		setCart([]);
	}

	return <Outlet />;
}

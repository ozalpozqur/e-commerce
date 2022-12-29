import { Outlet, useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import altogic from '../libs/altogic';
import { CartService } from '../services';
import { RootLoader } from '../loaders';
import { useColorStore, useCategoryStore, useAuthStore, useProductStore, useCartStore, useSizeStore } from '../store';
import product from '../store/product';

export default function InitialApp() {
	const { products, categories, cart, activeCategories, colors, sizes } = useLoaderData() as RootLoader;
	const { setProducts } = useProductStore();
	const { setCategories, setActiveCategories } = useCategoryStore();
	const { setCart } = useCartStore();
	const { user } = useAuthStore();
	const { setColors } = useColorStore();
	const { setSizes } = useSizeStore();

	useEffect(() => {
		setProducts(products.items, products.paginateData);
		setCategories(categories);
		setActiveCategories(activeCategories);
		setColors(colors);
		setSizes(sizes);
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

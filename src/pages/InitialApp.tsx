import { Outlet, useLoaderData } from 'react-router-dom';
import { Cart, Category, Product } from '../types/altogic';
import { useEffect } from 'react';
import useProductStore from '../store/product';
import useCategoryStore from '../store/category';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';

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
		if (user) {
			setCart(cart);
		}
	}, []);

	return <Outlet />;
}

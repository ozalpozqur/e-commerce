import { Outlet, useLoaderData } from 'react-router-dom';
import { Category, Product } from '../types/altogic';
import { useEffect } from 'react';
import useProductStore from '../store/product';
import useCategoryStore from '../store/category';

interface LoaderData {
	products: Product[];
	categories: Category[];
}
export default function InitialApp() {
	const { products, categories } = useLoaderData() as LoaderData;
	const { setProducts } = useProductStore();
	const { setCategories } = useCategoryStore();

	useEffect(() => {
		setProducts(products);
		setCategories(categories);
	}, []);

	return <Outlet />;
}

import ProductList from '../components/ProductList';
import ShopLayout from '../layouts/ShopLayout';
import { useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import useProductStore from '../store/product';

export default function Home() {
	const product = useLoaderData();
	const { setProducts } = useProductStore();

	useEffect(() => {
		// @ts-ignore
		setProducts(product);
	}, []);

	return (
		<ShopLayout>
			<div className="p-4">
				<ProductList />
			</div>
		</ShopLayout>
	);
}

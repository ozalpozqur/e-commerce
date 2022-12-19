import { useLoaderData } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { Product } from '../types/altogic';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Category() {
	const products = useLoaderData() as Product[];
	const noProductsInfoMessage = (
		<div className="text-center p-4 text-xl">
			<Player autoplay loop src="/no-product.json" style={{ height: '300px', width: '300px' }} />
			<p>No products found in this category</p>
		</div>
	);
	return <ProductList noProductsInfoMessage={noProductsInfoMessage} products={products} />;
}

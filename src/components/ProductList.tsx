import ProductCard from './ProductCard';
import useProductStore from '../store/product';
import { Product } from '../types/altogic';

export default function ProductList({ products }: { products?: Product[] }) {
	const { products: productsFromStore } = useProductStore();

	const _products = products ?? productsFromStore;

	return (
		<section className="container mx-auto px-4">
			<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
				{_products.length === 0 ? (
					<div>No products available</div>
				) : (
					_products.map(product => <ProductCard key={product._id} product={product} />)
				)}
			</div>
		</section>
	);
}

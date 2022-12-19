import ProductCard from './ProductCard';
import useProductStore from '../store/product';
import { Product } from '../types/altogic';

interface ProductListProps {
	products?: Product[];
	noProductsInfoMessage?: JSX.Element | string;
}

export default function ProductList({ products, noProductsInfoMessage }: ProductListProps) {
	const { products: productsFromStore } = useProductStore();

	const _products = products ?? productsFromStore;

	return (
		<section className="container mx-auto px-4">
			{_products.length === 0 ? (
				noProductsInfoMessage ?? <div className="p-2">No products found</div>
			) : (
				<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
					{_products.map(product => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			)}
		</section>
	);
}

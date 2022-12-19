import ProductCard from './ProductCard';
import useProductStore from '../store/product';

export default function ProductList() {
	const { products } = useProductStore();
	return (
		<section className="container mx-auto px-4">
			<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
				{products.length === 0 ? (
					<div>No products available</div>
				) : (
					products.map(product => <ProductCard key={product._id} product={product} />)
				)}
			</div>
		</section>
	);
}

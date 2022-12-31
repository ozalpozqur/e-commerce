import ProductList from '../components/ProductList';
import FeaturedProducts from '../components/FeaturedProducts';
import { useProductStore } from '../store';

export default function Home() {
	const { paginateData } = useProductStore();
	return (
		<section>
			<FeaturedProducts />
			{paginateData.currentPage === 1 && (
				<div className="text-center my-10 text-3xl md:text-4xl uppercase underline underline-offset-8">
					All Products
				</div>
			)}
			<ProductList />
		</section>
	);
}

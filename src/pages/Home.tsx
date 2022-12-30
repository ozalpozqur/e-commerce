import ProductList from '../components/ProductList';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
	return (
		<section>
			<FeaturedProducts />
			<div className="text-center my-10 text-3xl md:text-4xl uppercase underline underline-offset-8">
				All Products
			</div>
			<ProductList />
		</section>
	);
}

import ProductList from '../components/ProductList';
import { Product, Category } from '../types/altogic';

interface LoaderData {
	products: Product[];
	categories: Category[];
}
export default function Home() {
	return <ProductList />;
}

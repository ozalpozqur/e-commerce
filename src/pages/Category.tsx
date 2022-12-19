import { useLoaderData } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { Product } from '../types/altogic';

export default function Category() {
	const products = useLoaderData() as Product[];
	return <ProductList products={products} />;
}

import { Link } from 'react-router-dom';
import { Product } from '../types/altogic';

interface ProductProps {
	product: Product;
}
export default function ProductCard({ product }: ProductProps) {
	return (
		<div key={product._id} className="group relative">
			<div className="min-h-80 w-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75 lg:h-80">
				<img src={product.coverURL} alt={product.name} className="h-full w-full object-cover object-center" />
			</div>
			<div className="mt-4 flex justify-between">
				<div>
					<h3 className="text-sm text-gray-700">
						<Link to={`/product/${product._id}`}>
							<span aria-hidden="true" className="absolute inset-0" />
							{product.name}
						</Link>
					</h3>
				</div>
				<p className="text-sm font-medium text-gray-900">${product.price}</p>
			</div>
		</div>
	);
}

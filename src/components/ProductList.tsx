import ProductCard from './ProductCard';
import useProductStore from '../store/product';
import { Product } from '../types/altogic';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { ProductService } from '../services';
import Button from './ui/Button';
import { PRODUCT_LIMIT } from '../services/ProductService';

interface ProductListProps {
	products?: Product[];
	noProductsInfoMessage?: JSX.Element | string;
	categoryPage?: boolean;
}

export default function ProductList({ products, noProductsInfoMessage, categoryPage = false }: ProductListProps) {
	const { products: productsFromStore, paginateData, setProducts } = useProductStore();
	const _products = products ?? productsFromStore;
	const [searchParams, setSearchParams] = useSearchParams();
	const { slug } = useParams();

	const nextPage = useMemo(() => {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
		return page + 1;
	}, [searchParams, paginateData]);

	const prevPage = useMemo(() => {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
		return page - 1;
	}, [searchParams, paginateData]);

	const setPage = (page: number) => {
		searchParams.set('page', page.toString());
		setSearchParams(searchParams);
	};

	async function getPaginateProducts() {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

		const { items, paginateData } =
			categoryPage && slug
				? await ProductService.getProductsByCategory(slug, {
						onlyHasStock: true,
						page,
						limit: PRODUCT_LIMIT
				  })
				: await ProductService.getProducts({
						onlyHasStock: true,
						page,
						limit: PRODUCT_LIMIT
				  });
		setProducts(items, paginateData);
	}

	useEffect(() => {
		getPaginateProducts().catch(console.error);
	}, [searchParams]);

	return (
		<section className="container mx-auto px-4">
			{_products.length === 0 ? (
				noProductsInfoMessage ?? <div className="p-2">No products found</div>
			) : (
				<div className="pb-10 space-y-4">
					<div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
						{_products.map(product => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>

					{paginateData?.totalPages && paginateData.totalPages > 1 && (
						<div className="flex justify-center gap-1">
							<Button
								size="small"
								variant="white"
								onClick={() => setPage(prevPage)}
								disabled={Boolean(paginateData?.currentPage && paginateData.currentPage === 1)}
								className="border-gray-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3 w-3"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</Button>

							<div>
								<p className="h-8 w-12 flex items-center justify-center text-center tabular-nums rounded border border-gray-100 p-0 text-center text-xs font-medium">
									{searchParams.get('page') ?? 1}
								</p>
							</div>

							<Button
								size="small"
								variant="white"
								onClick={() => setPage(nextPage)}
								disabled={Boolean(paginateData?.totalPages && paginateData.totalPages < nextPage)}
								className="border-gray-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3 w-3"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</Button>
						</div>
					)}
				</div>
			)}
		</section>
	);
}

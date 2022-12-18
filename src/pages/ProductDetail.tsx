import { useLoaderData } from 'react-router-dom';
import { Product } from '../types/altogic';
import moneyFormat from '../helpers';
import Header from '../components/Header';
import useCartStore from '../store/cart';
import { ChangeEvent, useState } from 'react';

export default function () {
	const product = useLoaderData() as Product;
	const { addToCart } = useCartStore();
	const [quantity, setQuantity] = useState(1);

	function handleQuantity(e: ChangeEvent<HTMLInputElement>) {
		const number = e.target.valueAsNumber;
		if (!number) return setQuantity(1);
		if (number > product.qtyInStock) return setQuantity(product.qtyInStock);
		setQuantity(e.target.valueAsNumber);
	}

	function handleClick() {
		addToCart(product, quantity);
	}

	return (
		<>
			<Header />
			<section className="container mx-auto">
				<div className="relative max-w-screen-xl px-4 py-8 mx-auto">
					<div className="grid items-start grid-cols-1 gap-8 md:grid-cols-2">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-1">
							<img
								alt={product.name}
								src={product.coverURL}
								className="object-cover w-full aspect-square rounded-xl"
							/>
						</div>
						<div className="sticky top-0">
							<div className="flex justify-between mt-8">
								<div className="max-w-[35ch]">
									<h1 className="text-2xl font-bold">{product.name}</h1>
								</div>

								<p className="text-lg font-bold">{moneyFormat(product.price)}</p>
							</div>

							<details className="group relative mt-4 [&_summary::-webkit-details-marker]:hidden">
								<summary className="block">
									<div>
										<div className="prose max-w-none group-open:hidden">
											<p>{product.description}</p>
										</div>
									</div>
								</summary>
							</details>

							<div className="mt-8">
								<div className="flex mt-8">
									<div>
										<label htmlFor="quantity" className="sr-only">
											Qty
										</label>

										<input
											type="number"
											value={quantity}
											id="quantity"
											onChange={handleQuantity}
											min="1"
											className="w-20 rounded border-gray-200 py-3 text-center text-xs"
										/>
									</div>

									<button
										onClick={handleClick}
										className="block px-5 py-3 ml-3 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-500"
									>
										Add to Cart
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

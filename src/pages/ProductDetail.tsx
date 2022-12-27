import { useLoaderData, useNavigate } from 'react-router-dom';
import { Product } from '../types/altogic';
import moneyFormat from '../helpers';
import useCartStore from '../store/cart';
import { ChangeEvent, useState } from 'react';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import CartService from '../services/CartService';
import useAuthStore from '../store/auth';

export default function () {
	const product = useLoaderData() as Product;
	const { addToCart } = useCartStore();
	const { user } = useAuthStore();
	const [quantity, setQuantity] = useState(1);
	const [adding, setAdding] = useState(false);
	const navigate = useNavigate();

	function handleQuantity(e: ChangeEvent<HTMLInputElement>) {
		const number = e.target.valueAsNumber;
		if (!number) return setQuantity(1);
		if (number > product.qtyInStock) return setQuantity(product.qtyInStock);
		setQuantity(e.target.valueAsNumber);
	}

	async function handleClick() {
		if (!user) return navigate('/auth/login');
		try {
			setAdding(true);
			let cart = await CartService.addToCart({
				product: product._id,
				user: user._id,
				quantity
			});
			console.log(cart);
			addToCart(cart);
			toast.success('Product added');
		} catch (error) {
			console.log(error);
			// @ts-ignore
			toast.error(error.items[0].message);
		} finally {
			setAdding(false);
		}
	}

	return (
		<section className="container mx-auto">
			<div className="relative px-4 py-8 mx-auto">
				<div className="grid items-start grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-1">
						<img
							alt={product.name}
							src={product.coverURL}
							className="object-cover w-full aspect-square rounded-xl"
						/>
					</div>
					<div className="sticky top-0">
						<div className="flex justify-between">
							<div className="max-w-[35ch]">
								<h1 className="text-2xl font-bold">{product.name}</h1>
							</div>

							<p className="text-lg font-bold">{moneyFormat(product.price)}</p>
						</div>

						<div className="mt-4">
							<div className="font-bold text-lg text-gray-800">Description</div>
							<div className="prose">
								<p>{product.description}</p>
							</div>
						</div>

						<div className="mt-4">
							{product.qtyInStock > 1 ? (
								<div className="flex gap-2">
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
											className="w-20 rounded border-gray-200 py-3text-xs"
										/>
									</div>

									<Button loading={adding} onClick={handleClick}>
										Add to Cart
									</Button>
								</div>
							) : (
								<div className="text-red-600 font-semibold text-lg">Out of stock</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

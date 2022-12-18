import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product } from '../types/altogic';

export interface CartItem extends Product {
	quantityInCart: number;
}
interface CartState {
	items: CartItem[];
	totalAmount: number;
	addToCart: (product: Product, quantity: number) => void;
	removeProduct: (product: Product) => void;
}

const useCartStore = create<CartState>()(
	devtools(
		persist(
			set => ({
				items: [],
				totalAmount: 0,
				addToCart(product, quantity = 1) {
					set(prev => {
						const found = prev.items.find(item => item._id === product._id);
						let items;
						if (found) {
							found.quantityInCart++;
							items = prev.items;
						} else {
							items = [...prev.items, { ...product, quantityInCart: quantity }];
						}
						set({ totalAmount: calculateTotalPrice(items) });
						return { items };
					});
				},
				removeProduct(product) {
					set(prev => {
						const items = prev.items.filter(item => item._id !== product._id);
						set({ totalAmount: calculateTotalPrice(items) });
						return {
							items
						};
					});
				}
			}),
			{
				name: 'cart-storage'
			}
		)
	)
);

function calculateTotalPrice(items: CartItem[]) {
	return items.reduce((acc, curr) => {
		acc += curr.quantityInCart * curr.price;
		return acc;
	}, 0);
}

function isAlreadyExist(items: CartItem[], item: Product) {
	return items.find(i => i._id == item._id);
}

export default useCartStore;

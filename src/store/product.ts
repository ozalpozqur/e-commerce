import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Product } from '../types/altogic';

interface ProductState {
	products: Product[];
	setProducts: (products: Product[]) => void;
	addProduct: (product: Product) => void;
}

const useProductStore = create<ProductState>()(
	devtools(
		set => ({
			products: [],
			setProducts(products) {
				set({ products });
			},
			addProduct(product) {
				set(prev => ({ products: [product, ...prev.products] }));
			}
		}),
		{
			name: 'product-storage'
		}
	)
);

export default useProductStore;

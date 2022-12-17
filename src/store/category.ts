import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Category } from '../types/altogic';

interface CategoryState {
	categories: Category[];
	setCategories: (categories: Category[]) => void;
}

const useCategoryStore = create<CategoryState>()(
	devtools(
		set => ({
			categories: [],
			setCategories(categories) {
				set({ categories });
			}
		}),
		{
			name: 'category-storage'
		}
	)
);

export default useCategoryStore;

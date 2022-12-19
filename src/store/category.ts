import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Category } from '../types/altogic';

interface CategoryState {
	categories: Category[];
	setCategories: (categories: Category[]) => void;
	addCategory: (category: Category) => void;
}

const useCategoryStore = create<CategoryState>()(
	devtools(
		set => ({
			categories: [],
			setCategories(categories) {
				set({ categories });
			},
			addCategory(category) {
				set(prev => ({ categories: [...prev.categories, category] }));
			}
		}),
		{
			name: 'category-storage'
		}
	)
);

export default useCategoryStore;

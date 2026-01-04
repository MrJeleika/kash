import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/types/categories';
import { TransactionType } from '@/types/transactions';
import { CATEGORIES } from '@/constants/categories';

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Category) => void;
  removeCategory: (name: string) => void;
  updateCategory: (name: string, category: Partial<Category>) => void;
  getAllCategories: () => Category[];
  getCategoriesByType: (type: TransactionType) => Category[];
  getCategoryByName: (name: string) => Category | undefined;
}

const STORAGE_KEY = 'categories-storage';

export const useCategoriesStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: CATEGORIES,

      addCategory: (category) => {
        const existingCategory = get().getCategoryByName(category.name);
        if (existingCategory) {
          console.warn(`Category with name "${category.name}" already exists`);
          return;
        }
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      removeCategory: (name) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.name !== name),
        }));
      },

      updateCategory: (name, updatedFields) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.name === name ? { ...cat, ...updatedFields } : cat
          ),
        }));
      },

      getAllCategories: () => {
        return get().categories;
      },

      getCategoriesByType: (type) => {
        return get().categories.filter((cat) => cat.type === type);
      },

      getCategoryByName: (name) => {
        return get().categories.find((cat) => cat.name === name);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);

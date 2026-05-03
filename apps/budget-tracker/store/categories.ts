import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/types/categories';
import { TransactionType } from '@/types/transactions';
import { CATEGORIES } from '@/constants/categories';
import { generateUuid } from '@MrJeleika/utils';

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'updatedAt' | 'syncedAt'>) => Category;
  removeCategory: (name: string) => void;
  updateCategory: (name: string, category: Partial<Category>) => void;
  getAllCategories: () => Category[];
  getCategoriesByType: (type: TransactionType) => Category[];
  getCategoryByName: (name: string) => Category | undefined;

  getDirtyCategories: () => Category[];
  markSynced: (ids: string[], syncedAt: string) => void;
  purgeDeleted: (ids: string[]) => void;
}

const STORAGE_KEY = 'categories-storage';
const now = () => new Date().toISOString();

const seed: Category[] = CATEGORIES.map((c) => ({
  ...c,
  id: generateUuid(),
  updatedAt: now(),
  syncedAt: null,
}));

export const useCategoriesStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: seed,

      addCategory: (category) => {
        const existingCategory = get().getCategoryByName(category.name);
        if (existingCategory) {
          console.warn(`Category with name "${category.name}" already exists`);
          return existingCategory;
        }
        const ts = now();
        const created: Category = {
          ...category,
          id: generateUuid(),
          updatedAt: ts,
          syncedAt: null,
        };
        set((state) => ({ categories: [...state.categories, created] }));
        return created;
      },

      removeCategory: (name) => {
        const ts = now();
        set((state) => ({
          categories: state.categories.map((c) =>
            c.name === name
              ? { ...c, deletedAt: ts, updatedAt: ts, syncedAt: null }
              : c
          ),
        }));
      },

      updateCategory: (name, updatedFields) => {
        const ts = now();
        set((state) => ({
          categories: state.categories.map((c) =>
            c.name === name
              ? { ...c, ...updatedFields, updatedAt: ts, syncedAt: null }
              : c
          ),
        }));
      },

      getAllCategories: () =>
        get().categories.filter((c) => !c.deletedAt),

      getCategoriesByType: (type) =>
        get().categories.filter((c) => !c.deletedAt && c.type === type),

      getCategoryByName: (name) => {
        const c = get().categories.find((cat) => cat.name === name);
        return c && !c.deletedAt ? c : undefined;
      },

      getDirtyCategories: () =>
        get().categories.filter((c) => c.syncedAt === null && c.id),

      markSynced: (ids, syncedAt) => {
        const idSet = new Set(ids);
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id && idSet.has(c.id) ? { ...c, syncedAt } : c
          ),
        }));
      },

      purgeDeleted: (ids) => {
        const idSet = new Set(ids);
        set((state) => ({
          categories: state.categories.filter(
            (c) => !c.id || !idSet.has(c.id)
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ categories: state.categories }),
      version: 2,
      migrate: (persisted: unknown, fromVersion) => {
        const state = persisted as Partial<CategoryStore> | undefined;
        if (!state || fromVersion >= 2) return state as CategoryStore;
        const migratedAt = now();
        return {
          ...state,
          categories: (state.categories ?? []).map((c) => ({
            ...c,
            id: c.id ?? generateUuid(),
            updatedAt: c.updatedAt ?? migratedAt,
            syncedAt: c.syncedAt ?? null,
          })),
        } as CategoryStore;
      },
    }
  )
);

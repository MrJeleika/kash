import { Category } from '@/types/categories';

export const CATEGORIES: Category[] = [
  { name: 'Uncategorized', color: '#333333', type: 'expense', icon: 'CircleSlash' },
  { name: 'Food', color: '#CC2200', type: 'expense', icon: 'ForkKnife' },
  { name: 'Groceries', color: '#E07820', type: 'expense', icon: 'ShoppingBasket' },
  { name: 'Shopping', color: '#6B3FA0', type: 'expense', icon: 'ShoppingBag' },
  { name: 'Entertainment', color: '#D4A017', type: 'expense', icon: 'Popcorn' },
  { name: 'Sport', color: '#3A7D44', type: 'expense', icon: 'Dumbbell' },
  { name: 'Health', color: '#3A7DB0', type: 'expense', icon: 'ActivityIcon' },
  { name: 'Transport', color: '#6DA832', type: 'expense', icon: 'Car' },
  { name: 'Housing', color: '#2A5DA8', type: 'expense', icon: 'House' },
  { name: 'Education', color: '#FF5733', type: 'expense', icon: 'GraduationCap' },
  { name: 'Travel', color: '#FF5733', type: 'expense', icon: 'Plane' },
  { name: 'Subscriptions', color: '#FF5733', type: 'expense', icon: 'RefreshCcw' },
  { name: 'Salary', color: '#3A7D44', type: 'income', icon: 'Banknote' },
  { name: 'Freelance', color: '#4D8B3A', type: 'income', icon: 'Briefcase' },
  { name: 'Investments', color: '#2E7D5A', type: 'income', icon: 'TrendingUp' },
  { name: 'Gifts', color: '#A87332', type: 'income', icon: 'Gift' },
  { name: 'Other', color: '#7A7469', type: 'income', icon: 'Coins' },
];

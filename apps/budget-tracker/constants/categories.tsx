import { Category } from '@/types/categories';
import { colors } from '@MrJeleika/utils';

export const CATEGORIES = [
  {
    name: 'Uncategorized',
    color: '#333333',
    type: 'expense',
    icon: 'CircleSlash',
  },
  {
    name: 'Food',
    color: colors.red,
    type: 'expense',
    icon: 'ForkKnife',
  },
  {
    name: 'Groceries',
    color: colors.orange,
    type: 'expense',
    icon: 'ShoppingBasket',
  },
  {
    name: 'Shopping',
    color: colors.purple,
    type: 'expense',
    icon: 'ShoppingBag',
  },
  {
    name: 'Entertainment',
    color: colors.yellow,
    type: 'expense',
    icon: 'Popcorn',
  },
  {
    name: 'Sport',
    color: colors.green,
    type: 'expense',
    icon: 'Dumbbell',
  },
  {
    name: 'Health',
    color: colors.sky,
    type: 'expense',
    icon: 'ActivityIcon',
  },
  {
    name: 'Transport',
    color: colors['light-green'],
    type: 'expense',
    icon: 'Car',
  },
  {
    name: 'Housing',
    color: colors.blue,
    type: 'expense',
    icon: 'House',
  },
  {
    name: 'Education',
    color: '#FF5733',
    type: 'expense',
    icon: 'GraduationCap',
  },
  {
    name: 'Travel',
    color: '#FF5733',
    type: 'expense',
    icon: 'Plane',
  },
  {
    name: 'Subscriptions',
    color: '#FF5733',
    type: 'expense',
    icon: 'RefreshCcw',
  },
] as Category[];

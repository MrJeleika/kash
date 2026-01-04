import { LucideIcon } from 'lucide-react-native';
import { TransactionType } from './transactions';

export interface Category {
  name: string;
  color: string;
  type: TransactionType;
  icon: LucideIcon;
}

import { supabase } from './supabase';
import { useTransactionsStore } from '@/store/transactions';
import { useCategoriesStore } from '@/store/categories';
import type { Transaction } from '@/types/transactions';
import type { Category } from '@/types/categories';

const BATCH_SIZE = 50;

const transactionRow = (t: Transaction, userId: string) => ({
  id: t.id,
  user_id: userId,
  amount: t.amount,
  currency: t.currency,
  amount_in_base_currency: t.amountInBaseCurrency,
  base_currency: t.baseCurrency,
  category_name: t.categoryName,
  merchant: t.merchant ?? null,
  note: t.note ?? null,
  type: t.type,
  input_method: t.inputMethod ?? 'manual',
  date: t.date.slice(0, 10),
  updated_at: t.updatedAt,
});

const categoryRow = (c: Category, userId: string) => ({
  id: c.id!,
  user_id: userId,
  name: c.name,
  color: c.color,
  icon: c.icon,
  type: c.type,
  updated_at: c.updatedAt ?? new Date().toISOString(),
});

const chunks = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const pushPendingChanges = async (): Promise<{
  pushedTx: number;
  pushedCat: number;
  errors: string[];
}> => {
  const errors: string[] = [];
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return { pushedTx: 0, pushedCat: 0, errors: ['no_session'] };
  }

  let pushedTx = 0;
  let pushedCat = 0;

  // ---------- categories first (FK target for transactions.category_name is name, not id, but
  // we still want categories to land before any tx that references a brand-new category) ----------
  const dirtyCats = useCategoriesStore.getState().getDirtyCategories();
  if (dirtyCats.length) {
    const toDelete = dirtyCats.filter((c) => c.deletedAt && c.id);
    const toUpsert = dirtyCats.filter((c) => !c.deletedAt && c.id);

    for (const batch of chunks(toUpsert, BATCH_SIZE)) {
      const rows = batch.map((c) => categoryRow(c, userId));
      const { error } = await supabase.from('categories').upsert(rows);
      if (error) {
        errors.push(`categories.upsert: ${error.message}`);
        continue;
      }
      const syncedAt = new Date().toISOString();
      useCategoriesStore.getState().markSynced(
        batch.map((c) => c.id!),
        syncedAt
      );
      pushedCat += batch.length;
    }

    for (const batch of chunks(toDelete, BATCH_SIZE)) {
      const ids = batch.map((c) => c.id!);
      const { error } = await supabase
        .from('categories')
        .delete()
        .in('id', ids);
      if (error) {
        errors.push(`categories.delete: ${error.message}`);
        continue;
      }
      useCategoriesStore.getState().purgeDeleted(ids);
      pushedCat += batch.length;
    }
  }

  // ---------- transactions ----------
  const dirtyTx = useTransactionsStore.getState().getDirtyTransactions();
  if (dirtyTx.length) {
    const toDelete = dirtyTx.filter((t) => t.deletedAt);
    const toUpsert = dirtyTx.filter((t) => !t.deletedAt);

    for (const batch of chunks(toUpsert, BATCH_SIZE)) {
      const rows = batch.map((t) => transactionRow(t, userId));
      const { error } = await supabase.from('transactions').upsert(rows);
      if (error) {
        errors.push(`transactions.upsert: ${error.message}`);
        continue;
      }
      const syncedAt = new Date().toISOString();
      useTransactionsStore.getState().markSynced(
        batch.map((t) => t.id),
        syncedAt
      );
      pushedTx += batch.length;
    }

    for (const batch of chunks(toDelete, BATCH_SIZE)) {
      const ids = batch.map((t) => t.id);
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', ids);
      if (error) {
        errors.push(`transactions.delete: ${error.message}`);
        continue;
      }
      useTransactionsStore.getState().purgeDeleted(ids);
      pushedTx += batch.length;
    }
  }

  return { pushedTx, pushedCat, errors };
};

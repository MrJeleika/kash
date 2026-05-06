import { Header } from '@/components/common/header';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { SelectTransactionType } from '@/components/common/select-transaction-type';
import { Icon } from '@/components/ui/icon';
import { useModalsStore } from '@/store/modals';
import { useCategoriesStore } from '@/store/categories';
import { useTransactionsStore } from '@/store/transactions';
import { ChevronRight, Plus, Search } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CategoryIcon } from '@/components/common/category-icon';
import { TransactionType } from '@/types/transactions';
import { startOfMonth, endOfMonth } from '@/utils/format/dates';
import { formatNumberWithSpaces } from '@/utils/shared';
import { C, FONTS } from '@/utils/theme';

export const CategoriesModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const {
    categoriesModalOpen,
    setCategoriesModalOpen,
    setAddCategoryModalOpen,
    setCategoryToEdit,
  } = useModalsStore();

  const { categories } = useCategoriesStore();
  const transactions = useTransactionsStore((s) => s.transactions);

  const [type, setType] = useState<TransactionType>('expense');
  const [search, setSearch] = useState('');

  const monthSpend = useMemo(() => {
    const now = new Date();
    const from = startOfMonth(now).getTime();
    const to = endOfMonth(now).getTime();
    const map = new Map<string, { amount: number; count: number }>();
    for (const t of transactions) {
      if (t.deletedAt) continue;
      const ts = new Date(t.date).getTime();
      if (ts < from || ts > to) continue;
      const cur = map.get(t.categoryName) ?? { amount: 0, count: 0 };
      cur.amount += Math.abs(t.amountInBaseCurrency);
      cur.count += 1;
      map.set(t.categoryName, cur);
    }
    return map;
  }, [transactions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories
      .filter((c) => !c.deletedAt && c.type === type)
      .filter((c) => (q ? c.name.toLowerCase().includes(q) : true));
  }, [categories, type, search]);

  const expenseCount = categories.filter(
    (c) => !c.deletedAt && c.type === 'expense'
  ).length;
  const incomeCount = categories.filter(
    (c) => !c.deletedAt && c.type === 'income'
  ).length;

  const handleClose = () => modalRef.current?.close();

  const handleNew = () => {
    setCategoryToEdit(null);
    setAddCategoryModalOpen(true);
  };

  const handleEdit = (name: string) => {
    const cat = categories.find((c) => c.name === name);
    if (!cat) return;
    setCategoryToEdit(cat);
    setAddCategoryModalOpen(true);
  };

  return (
    <ModalBase
      isOpen={categoriesModalOpen}
      ref={modalRef}
      onClose={() => setCategoriesModalOpen(false)}
    >
      <Header
        title="CATEGORIES"
        closeButtonAction={handleClose}
        isModal
      />

      <View className="flex-1">
        {/* Type segmented */}
        <View className="px-6 pt-3.5 pb-2 items-center">
          <SegmentedTypeWithCount
            type={type}
            setType={setType}
            expenseCount={expenseCount}
            incomeCount={incomeCount}
          />
        </View>

        {/* Search */}
        <View className="px-6 pb-2.5">
          <View
            className="flex-row items-center px-3 py-2.5 gap-2"
            style={{
              backgroundColor: C.paperHi,
              borderWidth: 1,
              borderColor: C.rule,
            }}
          >
            <Icon icon={Search} size={13} color={C.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search categories…"
              placeholderTextColor={C.textMute}
              style={{
                flex: 1,
                fontFamily: FONTS.sans,
                fontSize: 13,
                lineHeight: 18,
                color: C.text,
                padding: 0,
              }}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Section heading */}
          <View className="flex-row items-baseline justify-between px-6 pt-1.5 pb-2">
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 10,
                lineHeight: 16,
                letterSpacing: 1.4,
                color: C.textMuted,
              }}
            >
              ACTIVE · {filtered.length}
            </Text>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: C.rule,
              borderBottomWidth: 1,
              borderBottomColor: C.rule,
            }}
          >
            {filtered.length === 0 ? (
              <View className="px-6 py-10 items-center">
                <Text style={{ color: C.textMuted, fontSize: 13, lineHeight: 18 }}>
                  No categories match your search.
                </Text>
              </View>
            ) : (
              filtered.map((c, i) => {
                const stats = monthSpend.get(c.name);
                return (
                  <Pressable
                    key={c.name}
                    onPress={() => handleEdit(c.name)}
                    className="flex-row items-center px-6 py-3 gap-3 active:opacity-70"
                    style={{
                      borderBottomWidth: i < filtered.length - 1 ? 1 : 0,
                      borderBottomColor: C.rule,
                    }}
                  >
                    <CategoryIcon category={c} size={36} />
                    <View className="flex-1">
                      <Text
                        style={{
                          fontFamily: FONTS.sansMedium,
                          fontSize: 14,
                          lineHeight: 20,
                          color: C.text,
                        }}
                      >
                        {c.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.monoSemi,
                          fontSize: 10,
                          lineHeight: 16,
                          color: C.textMuted,
                          letterSpacing: 0.6,
                          marginTop: 3,
                        }}
                      >
                        {stats ? `${stats.count} TXNS · MTD` : 'NO ACTIVITY'}
                      </Text>
                    </View>
                    {stats && (
                      <Text
                        style={{
                          fontFamily: FONTS.monoSemi,
                          fontSize: 13,
                          lineHeight: 18,
                          color: C.text,
                        }}
                      >
                        {formatNumberWithSpaces(stats.amount.toFixed(0))}
                      </Text>
                    )}
                    <Icon icon={ChevronRight} size={14} color={C.textMute} />
                  </Pressable>
                );
              })
            )}
          </View>

          {/* New Category CTA */}
          <View className="px-5 pt-4">
            <Pressable
              onPress={handleNew}
              className="flex-row items-center px-4 py-3.5 gap-3 active:opacity-80"
              style={{ backgroundColor: C.ink }}
            >
              <View
                className="items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderWidth: 1,
                  borderColor: C.textOnInkDim,
                  borderStyle: 'dashed',
                  borderRadius: 6,
                }}
              >
                <Icon icon={Plus} size={16} color={C.textOnInk} />
              </View>
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: FONTS.monoBold,
                    fontSize: 11,
                    lineHeight: 17,
                    letterSpacing: 1.98,
                    color: C.textOnInk,
                  }}
                >
                  NEW {type.toUpperCase()} CATEGORY
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    lineHeight: 17,
                    color: C.textOnInkDim,
                    marginTop: 3,
                  }}
                >
                  Pick a name, color and icon
                </Text>
              </View>
              <Icon icon={ChevronRight} size={14} color={C.textOnInk} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </ModalBase>
  );
};

const SegmentedTypeWithCount = ({
  type,
  setType,
  expenseCount,
  incomeCount,
}: {
  type: TransactionType;
  setType: (t: TransactionType) => void;
  expenseCount: number;
  incomeCount: number;
}) => (
  <View
    className="flex-row p-[3px]"
    style={{
      backgroundColor: C.paperHi,
      borderWidth: 1,
      borderColor: C.rule,
      width: '100%',
    }}
  >
    {[
      { key: 'expense' as const, label: 'EXPENSE', count: expenseCount },
      { key: 'income' as const, label: 'INCOME', count: incomeCount },
    ].map((tab) => {
      const active = type === tab.key;
      return (
        <Pressable
          key={tab.key}
          onPress={() => setType(tab.key)}
          className="flex-1 items-center justify-center py-2.5"
          style={{ backgroundColor: active ? C.ink : 'transparent' }}
        >
          <Text
            style={{
              fontFamily: active ? FONTS.monoBold : FONTS.monoSemi,
              fontSize: 11,
              lineHeight: 17,
              letterSpacing: 1.98,
              color: active ? C.textOnInk : C.textMuted,
            }}
          >
            {tab.label} · {tab.count}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

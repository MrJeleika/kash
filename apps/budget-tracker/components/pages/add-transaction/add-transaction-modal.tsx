import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { TransactionType } from '@/types/transactions';
import { useTransactionsStore } from '@/store/transactions';
import { useModalsStore } from '@/store/modals';
import { useCurrencyStore } from '@/store/currency';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { SelectTransactionType } from '@/components/common/select-transaction-type';
import { Keyboard } from '@/components/ui/keyboard/keyboard';
import { AnimatedText } from '@/utils/shared';
import SelectCategory from './category/select-category';
import { DateSelector } from './date-selector';
import { CurrencyBadge } from './currency-badge';
import { X, NotebookPen } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useCurrencyRateCalculator } from '@/hooks/currencies/useCurrencyRateCalculator';
import { useScreenKeyboardHandlers } from '@/hooks/keyboard/useScreenKeyboardHandlers';
import { useCategoriesStore } from '@/store/categories';
import { Eyebrow } from '@/components/ui/typography';
import { C, FONTS } from '@/utils/theme';

export function AddTransactionModal() {
  const modalRef = useRef<ModalBaseRef>(null);
  const { categories } = useCategoriesStore();
  const {
    setAddTransactionOpen,
    addTransactionOpen,
    setTransactionToEdit,
    transactionToEdit,
    transactionDraft,
    setTransactionDraft,
    draftSaveOverride,
    setDraftSaveOverride,
    openDateSheet,
  } = useModalsStore();

  const seed = transactionToEdit ?? transactionDraft;

  const { addTransaction, updateTransaction } = useTransactionsStore();
  const { currency: defaultCurrency } = useCurrencyStore();

  const [type, setType] = useState<TransactionType>(seed?.type || 'expense');
  const [categoryName, setCategoryName] = useState(
    seed?.categoryName || categories[0]?.name || ''
  );

  const {
    amount,
    handleKeyboardClick,
    handleBackspace,
    handleLongPress,
    setAmount,
  } = useScreenKeyboardHandlers(seed?.amount?.toString() || '0');
  const [currency, setCurrency] = useState(seed?.currency || defaultCurrency);
  const [date, setDate] = useState(
    seed?.date || new Date().toISOString().split('T')[0]
  );
  const [note, setNote] = useState(seed?.note || '');

  const { amountInBaseCurrency } = useCurrencyRateCalculator(currency, amount);
  const isDifferentCurrency = currency !== defaultCurrency;

  useEffect(() => {
    if (addTransactionOpen) {
      const s = transactionToEdit ?? transactionDraft;
      setType(s?.type || 'expense');
      setCategoryName(s?.categoryName || '');
      setAmount(s?.amount?.toString() || '0');
      setCurrency(s?.currency || defaultCurrency);
      setDate(s?.date || new Date().toISOString().split('T')[0]);
      setNote(s?.note || '');
    }
  }, [
    addTransactionOpen,
    defaultCurrency,
    setAmount,
    transactionToEdit,
    transactionDraft,
  ]);

  const handleClose = () => {
    modalRef.current?.close();
  };

  const handleSubmit = () => {
    if (!categoryName || !amount || !date) return;
    if (isDifferentCurrency && !amountInBaseCurrency) return;
    const amountNum = parseFloat(amount.replace(',', '.'));
    if (isNaN(amountNum) || amountNum <= 0) return;

    const isExpense = type === 'expense';
    const amountInBaseCurrencyNum = isDifferentCurrency
      ? Number(amountInBaseCurrency)
      : amountNum;

    if (draftSaveOverride) {
      draftSaveOverride({
        type,
        categoryName,
        amount: amountNum,
        amountInBaseCurrency: amountInBaseCurrencyNum,
        currency,
        date,
        note: note || undefined,
      });
    } else if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        type,
        categoryName,
        amount: isExpense ? -amountNum : amountNum,
        amountInBaseCurrency: isExpense
          ? -amountInBaseCurrencyNum
          : amountInBaseCurrencyNum,
        currency,
        date,
        note: note || undefined,
      });
    } else {
      addTransaction({
        type,
        categoryName,
        amount: isExpense ? -amountNum : amountNum,
        amountInBaseCurrency: isExpense
          ? -amountInBaseCurrencyNum
          : amountInBaseCurrencyNum,
        currency,
        date,
        note: note || undefined,
        baseCurrency: defaultCurrency,
        inputMethod: transactionDraft?.inputMethod ?? 'manual',
      });
    }

    setTransactionToEdit(null);
    setTransactionDraft(null);
    setDraftSaveOverride(null);
    handleClose();
  };

  const amountTooLong = amount.length > 8;

  return (
    <ModalBase
      ref={modalRef}
      isOpen={addTransactionOpen}
      onClose={() => {
        setAddTransactionOpen(false);
        setTransactionToEdit(null);
        setTransactionDraft(null);
        setDraftSaveOverride(null);
      }}
    >
      {/* Top bar: close + segmented + spacer */}
      <View
        className="flex-row items-center justify-between px-5 pt-3 pb-3"
        style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
      >
        <Pressable onPress={handleClose} hitSlop={10}>
          <Icon icon={X} size={20} color={C.ink} />
        </Pressable>
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 12,
            lineHeight: 18,
            letterSpacing: 2.16,
            color: C.ink,
            textTransform: 'uppercase',
          }}
        >
          New Entry
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <View className="flex-1">
        {/* Expense / Income segmented */}
        <View className="px-5 pt-4 items-center">
          <SelectTransactionType type={type} setType={setType} />
        </View>

        {/* Big amount — flexes to fill available height */}
        <View className="flex-1 px-5 items-center justify-center">
          <Eyebrow>Amount · {currency?.toUpperCase()}</Eyebrow>
          <View className="flex-row items-baseline justify-center mt-1.5">
            <Text
              style={{
                fontFamily: FONTS.monoMedium,
                fontSize: amountTooLong ? 22 : 26,
                lineHeight: Math.round((amountTooLong ? 22 : 26) * 1.2),
                color: C.textMute,
              }}
            >
              {currency === 'usd' ? '$' : currency === 'eur' ? '€' : ''}
            </Text>
            <AnimatedText
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: amountTooLong ? 48 : 64,
                lineHeight: Math.round((amountTooLong ? 48 : 64) * 1.2),
                color: C.ink,
                letterSpacing: -2,
              }}
              spaceStyle={{
                fontSize: amountTooLong ? 18 : 24,
                letterSpacing: 0,
              }}
              isNumber
            >
              {amount}
            </AnimatedText>
          </View>
          {isDifferentCurrency && amountInBaseCurrency && (
            <Text
              className="mt-1"
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                lineHeight: 17,
                color: C.textMuted,
                letterSpacing: 0.5,
              }}
            >
              ≈ {amountInBaseCurrency} {defaultCurrency?.toUpperCase()}
            </Text>
          )}
        </View>

        {/* Note + Date row */}
        <View className="flex-row gap-2 px-4 pt-3 pb-2">
          <View
            className="flex-1 flex-row items-center gap-2 px-3 py-2.5"
            style={{
              backgroundColor: C.paperHi,
              borderWidth: 1,
              borderColor: C.rule,
            }}
          >
            <Icon
              icon={NotebookPen}
              size={14}
              color={C.textMuted}
              strokeWidth={1.6}
            />
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Note"
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
          <DateSelector
            date={date}
            onPress={() =>
              openDateSheet({ value: date, onConfirm: setDate })
            }
          />
          <CurrencyBadge currency={currency} setCurrency={setCurrency} />
        </View>

        {/* Categories — horizontal scroll */}
        <View className="pt-2 pb-2">
          <SelectCategory
            type={type}
            selectedCategory={categoryName}
            onSelectCategory={setCategoryName}
          />
        </View>

        {/* Keyboard */}
        <View className="px-4 pt-2 pb-3">
          <Keyboard
            onClick={handleKeyboardClick}
            onBackspace={handleBackspace}
            onLongPress={handleLongPress}
          />
        </View>

        {/* Save button */}
        <View className="px-4 pt-3 pb-5">
          <Pressable
            onPress={handleSubmit}
            disabled={!categoryName || amount === '0'}
            className="h-14 items-center justify-center active:opacity-80"
            style={{
              backgroundColor: C.ink,
              opacity: !categoryName || amount === '0' ? 0.5 : 1,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: 12,
                lineHeight: 18,
                letterSpacing: 2.64,
                color: C.textOnInk,
                textTransform: 'uppercase',
              }}
            >
              {transactionToEdit ? 'Save Changes' : 'Save Transaction'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ModalBase>
  );
}

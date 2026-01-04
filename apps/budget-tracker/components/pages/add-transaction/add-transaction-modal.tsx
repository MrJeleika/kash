import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { TransactionType } from '@/types/transactions';
import { useTransactionsStore } from '@/store/transactions';
import { useModalsStore } from '@/store/modals';
import { useCurrencyStore } from '@/store/currency';
import { Button } from '@/components/ui/button/button';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { CloseButton } from '@/components/common/close-button';
import { SelectTransactionType } from '@/components/common/select-transaction-type';
import { Keyboard } from '@/components/ui/keyboard/keyboard';
import { AnimatedText, cn } from '@MrJeleika/utils';
import SelectCategory from './category/select-category';
import { DateSelector } from './date-selector';
import { CurrencyBadge } from './currency-badge';
import { MoreHorizontal } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useCurrencyRateCalculator } from '@/hooks/currencies/useCurrencyRateCalculator';
import { Input } from '@/components/ui/input/input';
import { useScreenKeyboardHandlers } from '@/hooks/keyboard/useScreenKeyboardHandlers';
import { useCategoriesStore } from '@/store/categories';

export function AddTransactionModal() {
  const modalRef = useRef<ModalBaseRef>(null);
  const { categories } = useCategoriesStore();
  const {
    setAddTransactionOpen,
    addTransactionOpen,
    setTransactionToEdit,
    transactionToEdit,
  } = useModalsStore();

  const { addTransaction, updateTransaction } = useTransactionsStore();
  const { currency: defaultCurrency } = useCurrencyStore();

  const [type, setType] = useState<TransactionType>(
    transactionToEdit?.type || 'expense'
  );
  const [categoryName, setCategoryName] = useState(
    transactionToEdit?.categoryName || categories[0]?.name || ''
  );

  const {
    amount,
    handleKeyboardClick,
    handleBackspace,
    handleLongPress,
    setAmount,
  } = useScreenKeyboardHandlers(transactionToEdit?.amount.toString() || '0');
  const [currency, setCurrency] = useState(
    transactionToEdit?.currency || defaultCurrency
  );
  const [date, setDate] = useState(
    transactionToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [note, setNote] = useState(transactionToEdit?.note || '');

  const { amountInBaseCurrency } = useCurrencyRateCalculator(currency, amount);

  const isDifferentCurrency = currency !== defaultCurrency;

  useEffect(() => {
    if (addTransactionOpen) {
      setType(transactionToEdit?.type || 'expense');
      setCategoryName(transactionToEdit?.categoryName || '');
      setAmount(transactionToEdit?.amount.toString() || '0');
      setCurrency(transactionToEdit?.currency || defaultCurrency);
      setDate(
        transactionToEdit?.date || new Date().toISOString().split('T')[0]
      );
      setNote(transactionToEdit?.note || '');
    }
  }, [addTransactionOpen, defaultCurrency, setAmount, transactionToEdit]);

  const handleClose = () => {
    modalRef.current?.close();
  };

  const handleSubmit = () => {
    if (!categoryName || !amount || !date) {
      console.log('Missing required fields');
      return;
    }

    if (isDifferentCurrency && !amountInBaseCurrency) {
      console.log('Missing amount in base currency');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.log('Invalid amount');
      return;
    }

    const isExpense = type === 'expense';

    const amountInBaseCurrencyNum = isDifferentCurrency
      ? Number(amountInBaseCurrency)
      : amountNum;

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        amount: isExpense ? amountNum : -amountNum,
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
      });
    }

    setTransactionToEdit(null);
    handleClose();
  };

  return (
    <ModalBase
      ref={modalRef}
      isOpen={addTransactionOpen}
      onClose={() => {
        setAddTransactionOpen(false);
        setTransactionToEdit(null);
      }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <CloseButton onPress={handleClose} />
        <SelectTransactionType type={type} setType={setType} />
        <Pressable className="size-[35px] rounded-full bg-zinc-900 items-center justify-center active:opacity-70">
          <Icon icon={MoreHorizontal} className="text-white" size={20} />
        </Pressable>
      </View>

      <View className="items-center min-h-[15vh] justify-center mb-8 mt-4">
        <AnimatedText
          className={cn(
            'text-white text-5xl font-semibold',
            amount.length > 3 && 'text-4xl',
            amount.length > 6 && 'text-3xl',
            amount.length > 9 && 'text-2xl',
            amount.length > 12 && 'text-xl'
          )}
          suffix={` ${currency?.toUpperCase()}`}
          isNumber={true}
        >
          {amount}
        </AnimatedText>
        {currency !== defaultCurrency && amountInBaseCurrency && (
          <AnimatedText
            className={cn(
              'text-secondary-text text-2xl font-semibold',
              amount.length > 9 && 'text-xl',
              amount.length > 12 && 'text-lg'
            )}
            suffix={` ${defaultCurrency?.toUpperCase()}`}
            isNumber={true}
          >
            {amountInBaseCurrency}
          </AnimatedText>
        )}
      </View>

      {/* Wallet, Date, and Currency Row */}
      <View className="flex-row justify-between  mb-0.5">
        {/* <View className="flex-1">
          <WalletSelector
            walletName="Wallet"
            amount={walletBalance}
            currency={currency}
            onPress={() => {
              // TODO: Open wallet selector
              console.log('Open wallet selector');
            }}
          />
        </View> */}
        <DateSelector
          date={date}
          onPress={() => {
            // TODO: Open date picker
            console.log('Open date picker');
          }}
        />
        <CurrencyBadge currency={currency} setCurrency={setCurrency} />
      </View>

      {/* Note Input */}
      <View className="mb-0.5">
        <Input
          value={note}
          className="bg-dark-gray border-0 min-h-[30px]"
          onChangeText={setNote}
          placeholder="Note"
        />
      </View>

      {/* Category Selector */}
      <View className="mb-2">
        <SelectCategory
          type={type}
          selectedCategory={categoryName}
          onSelectCategory={setCategoryName}
        />
      </View>

      {/* Keyboard */}
      <View className="mb-4">
        <Keyboard
          onClick={handleKeyboardClick}
          onBackspace={handleBackspace}
          onLongPress={handleLongPress}
        />
      </View>

      {/* Save Button */}
      <Button
        onPress={handleSubmit}
        disabled={!categoryName || amount === '0'}
        className="py-4 mb-4 rounded-2xl"
      >
        <Text className="text-black text-base font-semibold">Save</Text>
      </Button>
    </ModalBase>
  );
}

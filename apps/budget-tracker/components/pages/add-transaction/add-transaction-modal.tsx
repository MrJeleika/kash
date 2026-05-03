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
    transactionDraft,
    setTransactionDraft,
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
  const [currency, setCurrency] = useState(
    seed?.currency || defaultCurrency
  );
  const [date, setDate] = useState(
    seed?.date || new Date().toISOString().split('T')[0]
  );
  const [note, setNote] = useState(seed?.note || '');
  const [merchant, setMerchant] = useState(seed?.merchant || '');

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
      setMerchant(s?.merchant || '');
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
        merchant: merchant.trim() || undefined,
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
        merchant: merchant.trim() || undefined,
        baseCurrency: defaultCurrency,
        inputMethod: transactionDraft?.inputMethod ?? 'manual',
      });
    }

    setTransactionToEdit(null);
    setTransactionDraft(null);
    handleClose();
  };

  return (
    <ModalBase
      ref={modalRef}
      isOpen={addTransactionOpen}
      onClose={() => {
        setAddTransactionOpen(false);
        setTransactionToEdit(null);
        setTransactionDraft(null);
      }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <CloseButton onPress={handleClose} />
        <SelectTransactionType type={type} setType={setType} />
        <Pressable className="size-[35px] rounded-full bg-surface-raised items-center justify-center active:opacity-70">
          <Icon icon={MoreHorizontal} className="text-text" size={20} />
        </Pressable>
      </View>

      <View className="items-center min-h-[15vh] justify-center mb-8 mt-4">
        <AnimatedText
          className={cn(
            'text-text text-5xl font-semibold',
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
              'text-text-muted text-2xl font-semibold',
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

      {/* Merchant + Note inputs */}
      <View className="gap-1 mb-0.5">
        <Input
          value={merchant}
          className="bg-surface border-0 min-h-[30px]"
          onChangeText={setMerchant}
          placeholder="Merchant (optional)"
        />
        <Input
          value={note}
          className="bg-surface border-0 min-h-[30px]"
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

      {/* Commit Changes */}
      <Button
        variant="accent"
        onPress={handleSubmit}
        disabled={!categoryName || amount === '0'}
        className="py-4 mb-4 rounded-2xl"
      >
        <Text className="text-background text-base font-semibold uppercase tracking-widest">
          {transactionToEdit ? 'Save Changes' : 'Commit Changes'}
        </Text>
      </Button>
    </ModalBase>
  );
}

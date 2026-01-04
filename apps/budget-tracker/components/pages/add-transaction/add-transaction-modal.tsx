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
import { WalletSelector } from './wallet-selector';
import { DateSelector } from './date-selector';
import { CurrencyBadge } from './currency-badge';
import { NoteInput } from './note-input';
import { MoreHorizontal } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface AddTransactionModalProps {
  defaultType?: TransactionType;
}

export function AddTransactionModal({ defaultType }: AddTransactionModalProps) {
  const modalRef = useRef<ModalBaseRef>(null);
  const addTransactionOpen = useModalsStore(
    (state) => state.addTransactionOpen
  );
  const setAddTransactionOpen = useModalsStore(
    (state) => state.setAddTransactionOpen
  );
  const addTransaction = useTransactionsStore((state) => state.addTransaction);
  const { currency: defaultCurrency } = useCurrencyStore();

  const [type, setType] = useState<TransactionType>(defaultType || 'expense');
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState(defaultCurrency.toUpperCase());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const walletBalance = '434.8';

  useEffect(() => {
    if (defaultType) {
      setType(defaultType);
    }
  }, [defaultType]);

  useEffect(() => {
    if (addTransactionOpen) {
      // Reset form when modal opens
      setType(defaultType || 'expense');
      setCategoryName('');
      setAmount('0');
      setCurrency(defaultCurrency.toUpperCase());
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [addTransactionOpen, defaultType, defaultCurrency]);

  const handleClose = () => {
    modalRef.current?.close();
  };

  const handleSubmit = () => {
    if (!categoryName || !amount || !date) {
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    addTransaction({
      type,
      categoryName,
      amount: amountNum,
      amountInBaseCurrency: amountNum, // Assuming same currency for now
      currency,
      date,
      note: note || undefined,
    });

    handleClose();
  };

  const handleKeyboardClick = (key: string) => {
    if (amount.length > 18) return;

    if (key === ',') {
      // Handle decimal point
      if (!amount.includes('.')) {
        setAmount(amount === '0' ? '0.' : amount + '.');
      }
    } else {
      if (amount === '0') {
        setAmount(key);
      } else {
        setAmount(amount + key);
      }
    }
  };

  const handleBackspace = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handleLongPress = () => {
    setAmount('0');
  };
  return (
    <ModalBase
      ref={modalRef}
      isOpen={addTransactionOpen}
      onClose={() => setAddTransactionOpen(false)}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <CloseButton onPress={handleClose} />
        <SelectTransactionType type={type} setType={setType} />
        <Pressable className="size-[35px] rounded-full bg-zinc-900 items-center justify-center active:opacity-70">
          <Icon icon={MoreHorizontal} className="text-white" size={20} />
        </Pressable>
      </View>

      {/* Amount Display */}
      <View className="items-center min-h-[15vh] justify-center mb-8 mt-4">
        <AnimatedText
          className={cn(
            'text-white text-5xl font-light',
            amount.length > 3 && 'text-4xl',
            amount.length > 6 && 'text-3xl',
            amount.length > 9 && 'text-2xl',
            amount.length > 12 && 'text-xl'
          )}
          suffix={` ${currency}`}
          isNumber={true}
        >
          {amount}
        </AnimatedText>
      </View>

      {/* Wallet, Date, and Currency Row */}
      <View className="flex-row gap-2 mb-4">
        <View className="flex-1">
          <WalletSelector
            walletName="Wallet"
            amount={walletBalance}
            currency={currency}
            onPress={() => {
              // TODO: Open wallet selector
              console.log('Open wallet selector');
            }}
          />
        </View>
        <DateSelector
          date={date}
          onPress={() => {
            // TODO: Open date picker
            console.log('Open date picker');
          }}
        />
        <CurrencyBadge
          currency={currency}
          onPress={() => {
            // TODO: Open currency selector
            console.log('Open currency selector');
          }}
        />
      </View>

      {/* Note Input */}
      <View className="mb-4">
        <NoteInput value={note} onChangeText={setNote} />
      </View>

      {/* Category Selector */}
      <View className="mb-4">
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

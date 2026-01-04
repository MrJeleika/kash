import { useCallback, useEffect, useState } from 'react';

export const useScreenKeyboardHandlers = (initialAmount: string = '0') => {
  const [amount, setAmount] = useState(initialAmount);

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  const handleKeyboardClick = useCallback(
    (key: string) => {
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
    },
    [amount]
  );

  const handleBackspace = useCallback(() => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  }, [amount]);

  const handleLongPress = useCallback(() => {
    setAmount('0');
  }, []);

  return {
    amount,
    handleKeyboardClick,
    handleBackspace,
    handleLongPress,
    setAmount,
  };
};

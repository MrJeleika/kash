import { Pressable, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

interface SelectTransactionTypeProps {
  type: 'income' | 'expense';
  setType: (type: 'income' | 'expense') => void;
}

export const SelectTransactionType = ({
  type,
  setType,
}: SelectTransactionTypeProps) => {
  const Tab = ({ value, label }: { value: 'expense' | 'income'; label: string }) => {
    const active = type === value;
    return (
      <Pressable
        onPress={() => setType(value)}
        className="flex-1 items-center justify-center py-2"
        style={{
          backgroundColor: active ? C.ink : 'transparent',
        }}
      >
        <Text
          style={{
            fontFamily: active ? FONTS.monoBold : FONTS.monoSemi,
            fontSize: 11,
            lineHeight: 17,
            letterSpacing: 1.98,
            color: active ? C.textOnInk : C.textMuted,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      className="flex-row p-[3px]"
      style={{
        backgroundColor: C.paperHi,
        borderWidth: 1,
        borderColor: C.rule,
        width: 220,
      }}
    >
      <Tab value="expense" label="Expense" />
      <Tab value="income" label="Income" />
    </View>
  );
};

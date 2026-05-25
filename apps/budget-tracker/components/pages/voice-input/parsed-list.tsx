import { Pressable, Text, View } from 'react-native';
import { CurrencyRates } from '@/types/currencies';
import { C, FONTS } from '@/utils/theme';
import { ParsedItem } from './state';
import { ParsedRow } from './parsed-row';

type Props = {
  items: ParsedItem[];
  defaultCurrency: string;
  rates: Record<string, CurrencyRates> | undefined;
  onEdit: (item: ParsedItem) => void;
  onRemove: (id: string) => void;
  onConfirm: () => void;
};

export const ParsedList = ({
  items,
  defaultCurrency,
  rates,
  onEdit,
  onRemove,
  onConfirm,
}: Props) => (
  <View
    className="mt-5"
    style={{
      backgroundColor: C.inkSoft,
      borderWidth: 1,
      borderColor: C.inkLine,
    }}
  >
    <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
      <Text
        style={{
          fontFamily: FONTS.monoSemi,
          fontSize: 10,
          lineHeight: 16,
          color: C.red,
        }}
      >
        ● {items.length} item{items.length === 1 ? '' : 's'}
      </Text>
    </View>
    <View>
      {items.map((p, i) => (
        <ParsedRow
          key={p.id}
          item={p}
          isFirst={i === 0}
          defaultCurrency={defaultCurrency}
          rates={rates}
          onPress={() => onEdit(p)}
          onDelete={() => onRemove(p.id)}
        />
      ))}
    </View>
    <View className="px-4 pb-4">
      <Pressable
        onPress={onConfirm}
        className="mt-3 h-11 items-center justify-center"
        style={{ backgroundColor: C.red }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 11,
            lineHeight: 17,
            letterSpacing: 1.76,
            color: C.textOnInk,
            textTransform: 'uppercase',
          }}
        >
          Confirm & save
        </Text>
      </Pressable>
    </View>
  </View>
);

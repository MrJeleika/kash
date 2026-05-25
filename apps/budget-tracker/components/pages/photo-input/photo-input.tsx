import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { CategoryIcon } from '@/components/common/category-icon';
import { Icon } from '@/components/ui/icon';
import { HeroAmount } from '@/components/ui/typography';
import { useOcrReceipt } from '@/hooks/photo/useOcrReceipt';
import { useCategoriesStore } from '@/store/categories';
import { useCurrencyStore } from '@/store/currency';
import { useModalsStore } from '@/store/modals';
import { useTransactionsStore } from '@/store/transactions';
import { useCurrencyRates } from '@/hooks/currencies/useCurrencyRates';
import { CurrencyRates } from '@/types/currencies';
import { splitAmount } from '@/utils/format';
import { C, FONTS } from '@/utils/theme';
import { convertToBase, todayIso } from '../voice-input/utils';

type Status = 'scanning' | 'ready' | 'empty' | 'error';

type Parsed = {
  type: 'expense' | 'income';
  categoryName: string;
  merchant: string | null;
  amount: number;
  currency: string;
  date: string;
};

const cornerSize = 14;
const cornerThick = 2;

const PhotoMarkers = () => (
  <>
    {(
      [
        ['top', 'left'],
        ['top', 'right'],
        ['bottom', 'left'],
        ['bottom', 'right'],
      ] as const
    ).map(([v, h]) => (
      <View
        key={`${v}-${h}`}
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: cornerSize,
          height: cornerSize,
          [v]: 8,
          [h]: 8,
          borderColor: C.red,
          borderTopWidth: v === 'top' ? cornerThick : 0,
          borderBottomWidth: v === 'bottom' ? cornerThick : 0,
          borderLeftWidth: h === 'left' ? cornerThick : 0,
          borderRightWidth: h === 'right' ? cornerThick : 0,
        }}
      />
    ))}
  </>
);

const ScanLine = ({ active }: { active: boolean }) => {
  const y = useSharedValue(0);

  useEffect(() => {
    if (active) {
      y.value = 0;
      y.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      y.value = withTiming(0, { duration: 200 });
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    top: `${y.value * 96}%`,
    opacity: active ? 0.9 : 0,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: C.red,
          shadowColor: C.red,
          shadowOpacity: 0.8,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
};

const ScanningLabel = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className="flex-row items-center gap-2"
      style={style}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: C.red,
        }}
      />
      <Text
        style={{
          fontFamily: FONTS.monoBold,
          fontSize: 11,
          letterSpacing: 1.76,
          color: C.text,
          textTransform: 'uppercase',
        }}
      >
        Scanning
      </Text>
    </Animated.View>
  );
};

export const PhotoInput = () => {
  const photoInputOpen = useModalsStore((s) => s.photoInputOpen);
  const photoInputUri = useModalsStore((s) => s.photoInputUri);
  const closePhotoInput = useModalsStore((s) => s.closePhotoInput);
  const setTransactionDraft = useModalsStore((s) => s.setTransactionDraft);
  const setAddTransactionOpen = useModalsStore((s) => s.setAddTransactionOpen);
  const setDraftSaveOverride = useModalsStore((s) => s.setDraftSaveOverride);

  const { currency: baseCurrency } = useCurrencyStore();
  const { getCategoryByName } = useCategoriesStore();
  const { addTransaction } = useTransactionsStore();
  const { data: ratesResponse } = useCurrencyRates();
  const rates = ratesResponse as
    | (Record<string, CurrencyRates> & { date?: string })
    | undefined;

  const ocr = useOcrReceipt();
  const [status, setStatus] = useState<Status>('scanning');
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Run OCR each time the modal opens with a fresh uri.
  useEffect(() => {
    if (!photoInputOpen || !photoInputUri) return;

    let cancelled = false;
    setStatus('scanning');
    setParsed(null);
    setError(null);

    ocr
      .mutateAsync({ uri: photoInputUri })
      .then((result) => {
        if (cancelled) return;
        const tx = result.transaction;
        if (!tx || !tx.amount) {
          setStatus('empty');
          return;
        }
        setParsed({
          type: tx.type,
          categoryName: tx.categoryName,
          merchant: tx.merchant,
          amount: Math.abs(tx.amount),
          currency: (tx.currency ?? baseCurrency).toLowerCase(),
          // Default to today so the saved transaction lands in the current
          // month view. User can override via the edit modal if they want to
          // pin it to the printed receipt date.
          date: todayIso(),
        });
        setStatus('ready');
      })
      .catch((err: any) => {
        if (cancelled) return;
        const msg =
          err?.status === 429
            ? 'Monthly limit reached. Try again next month.'
            : err?.message || "Couldn't read receipt.";
        setError(msg);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [photoInputOpen, photoInputUri]);

  const category = parsed ? getCategoryByName(parsed.categoryName) : null;

  const baseAmount = useMemo(() => {
    if (!parsed) return 0;
    return convertToBase(parsed.amount, parsed.currency, baseCurrency, rates);
  }, [parsed, baseCurrency, rates]);

  const openEdit = () => {
    if (!parsed) return;
    setTransactionDraft({
      type: parsed.type,
      categoryName: parsed.categoryName,
      amount: parsed.amount,
      amountInBaseCurrency: baseAmount,
      currency: parsed.currency,
      baseCurrency,
      merchant: parsed.merchant || undefined,
      date: parsed.date,
      inputMethod: 'photo',
    });
    setDraftSaveOverride((payload) => {
      setParsed((prev) =>
        prev
          ? {
              ...prev,
              type: payload.type,
              categoryName: payload.categoryName,
              amount: Math.abs(payload.amount),
              currency: payload.currency.toLowerCase(),
              date: payload.date,
            }
          : prev
      );
    });
    setAddTransactionOpen(true);
  };

  const commit = () => {
    if (!parsed) return;
    const isExpense = parsed.type === 'expense';
    const amount = Math.abs(parsed.amount);
    const resolvedCategory =
      getCategoryByName(parsed.categoryName)?.name ?? parsed.categoryName;
    addTransaction({
      type: parsed.type,
      categoryName: resolvedCategory,
      amount: isExpense ? -amount : amount,
      currency: parsed.currency,
      amountInBaseCurrency: isExpense ? -baseAmount : baseAmount,
      baseCurrency,
      merchant: parsed.merchant || undefined,
      date: parsed.date,
      inputMethod: 'photo',
    });
    closePhotoInput();
  };

  if (!photoInputOpen) return null;

  const { whole, cents } = parsed
    ? splitAmount(parsed.amount)
    : { whole: '0', cents: '00' };
  const isDifferentCurrency =
    parsed && parsed.currency !== baseCurrency;

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(160)}
      className="absolute inset-0 z-50"
      style={{ backgroundColor: C.paper }}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pt-16 pb-4"
        style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 12,
            letterSpacing: 2.16,
            color: C.text,
            textTransform: 'uppercase',
          }}
        >
          Receipt · {status === 'scanning' ? 'Scan' : 'Parsed'}
        </Text>
        <Pressable hitSlop={12} onPress={closePhotoInput}>
          <Icon icon={X} size={18} color={C.text} strokeWidth={1.6} />
        </Pressable>
      </View>

      {/* Photo */}
      <View className="px-6 pt-6">
        <View
          style={{
            height: 240,
            backgroundColor: C.paperHi,
            borderWidth: 1,
            borderColor: C.rule,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {photoInputUri ? (
            <Image
              source={{ uri: photoInputUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : null}
          <PhotoMarkers />
          <ScanLine active={status === 'scanning'} />
        </View>
        {status === 'scanning' && (
          <View className="mt-4 flex-row items-center justify-between">
            <ScanningLabel />
          </View>
        )}
      </View>

      {/* Result */}
      {status === 'ready' && parsed && (
        <Animated.View
          entering={FadeIn.duration(260)}
          className="px-6 pt-6"
        >
          <Text
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 10,
              letterSpacing: 1.4,
              color: C.textMuted,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Extracted total
          </Text>
          <Pressable onPress={openEdit} className="active:opacity-70">
            <View className="flex-row items-baseline justify-between">
              <HeroAmount
                whole={whole}
                cents={cents}
                size={56}
                suffix={parsed.currency.toUpperCase()}
                suffixSize={13}
                prefix={parsed.type === 'expense' ? '−' : '+'}
              />
              <Text
                style={{
                  fontFamily: FONTS.monoSemi,
                  fontSize: 10,
                  letterSpacing: 1.4,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                }}
              >
                Tap to edit
              </Text>
            </View>
            {isDifferentCurrency ? (
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: C.textMuted,
                  marginTop: 4,
                }}
              >
                ≈ {baseAmount.toFixed(2)} {baseCurrency.toUpperCase()}
              </Text>
            ) : null}
          </Pressable>

          {/* Entry row */}
          <Pressable
            onPress={openEdit}
            className="mt-5 flex-row items-center gap-3 px-3 py-3 active:opacity-80"
            style={{
              backgroundColor: C.paperHi,
              borderWidth: 1,
              borderColor: C.rule,
            }}
          >
            {category ? (
              <CategoryIcon category={category} size={32} />
            ) : (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: C.paperDim,
                }}
              />
            )}
            <View className="flex-1">
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.sansMedium,
                  fontSize: 14,
                  color: C.text,
                }}
              >
                {parsed.merchant || parsed.categoryName}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: C.textMuted,
                  marginTop: 2,
                  letterSpacing: 0.3,
                }}
              >
                {parsed.categoryName}
                {parsed.merchant ? ' · ' + parsed.date : ''}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 14,
                color: C.text,
              }}
            >
              {parsed.type === 'expense' ? '−' : '+'}
              {parsed.amount.toFixed(2)} {parsed.currency.toUpperCase()}
            </Text>
          </Pressable>

          {/* Confirm */}
          <Pressable
            onPress={commit}
            className="mt-6 h-14 items-center justify-center active:opacity-85"
            style={{ backgroundColor: C.ink }}
          >
            <Text
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: 12,
                letterSpacing: 2.16,
                color: C.textOnInk,
                textTransform: 'uppercase',
              }}
            >
              Save transaction
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Empty / error */}
      {(status === 'empty' || status === 'error') && (
        <View className="px-6 pt-10 items-center">
          <Text
            style={{
              fontFamily: FONTS.serifItalic,
              fontSize: 18,
              lineHeight: 26,
              color: C.textMuted,
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            {status === 'empty'
              ? "Couldn't read anything from that photo."
              : error}
          </Text>
          <Pressable
            onPress={closePhotoInput}
            className="h-12 px-8 items-center justify-center active:opacity-85"
            style={{ borderWidth: 1, borderColor: C.rule }}
          >
            <Text
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: 11,
                letterSpacing: 1.76,
                color: C.text,
                textTransform: 'uppercase',
              }}
            >
              Close
            </Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};

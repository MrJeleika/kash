import { Pressable, Text, View } from 'react-native';
import { useTransactionsStore } from '@/store/transactions';
import { useCurrencyStore } from '@/store/currency';
import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
import { useCurrencyRates } from '@/hooks/currencies/useCurrencyRates';
import { CurrencyRates } from '@/types/currencies';
import { C, FONTS } from '@/utils/theme';
import { ParsedList } from './parsed-list';
import { ParsedItem } from './state';
import { useVoiceMachine } from './use-voice-machine';
import { convertToBase, todayIso } from './utils';

interface Props {
  voiceInputOpen: boolean;
}

export const TextRecognition = ({ voiceInputOpen }: Props) => {
  const { ctx, dispatch } = useVoiceMachine(voiceInputOpen);
  const { addTransaction } = useTransactionsStore();
  const { currency: defaultCurrency } = useCurrencyStore();
  const { getCategoryByName } = useCategoriesStore();
  const setVoiceInputOpen = useModalsStore((s) => s.setVoiceInputOpen);
  const setTransactionDraft = useModalsStore((s) => s.setTransactionDraft);
  const setAddTransactionOpen = useModalsStore((s) => s.setAddTransactionOpen);
  const setDraftSaveOverride = useModalsStore((s) => s.setDraftSaveOverride);
  const { data: ratesResponse } = useCurrencyRates();

  const rates = ratesResponse as
    | (Record<string, CurrencyRates> & { date?: string })
    | undefined;

  const editItem = (item: ParsedItem) => {
    const baseAmount = convertToBase(
      item.amount,
      item.currency,
      defaultCurrency,
      rates
    );
    setTransactionDraft({
      type: item.type,
      categoryName: item.categoryName,
      amount: item.amount,
      amountInBaseCurrency: baseAmount,
      currency: item.currency,
      baseCurrency: defaultCurrency,
      date: todayIso(),
      inputMethod: 'voice',
    });
    setDraftSaveOverride((payload) => {
      dispatch({
        type: 'UPDATE_ITEM',
        id: item.id,
        patch: {
          type: payload.type,
          categoryName: payload.categoryName,
          amount: Math.abs(payload.amount),
          currency: payload.currency.toLowerCase(),
        },
      });
    });
    setAddTransactionOpen(true);
  };

  const commit = () => {
    for (const p of ctx.parsed) {
      const isExpense = p.type === 'expense';
      const amount = Math.abs(p.amount);
      const baseAmount = convertToBase(
        amount,
        p.currency,
        defaultCurrency,
        rates
      );
      const category =
        getCategoryByName(p.categoryName)?.name ?? p.categoryName;
      addTransaction({
        type: p.type,
        categoryName: category,
        amount: isExpense ? -amount : amount,
        currency: p.currency,
        amountInBaseCurrency: isExpense ? -baseAmount : baseAmount,
        baseCurrency: defaultCurrency,
        date: todayIso(),
        inputMethod: 'voice',
      });
    }
    setVoiceInputOpen(false);
  };

  return (
    <View
      className="absolute left-0 right-0 px-6"
      style={{ top: 360, bottom: 130 }}
    >
      <Text
        style={{
          fontFamily: FONTS.monoSemi,
          fontSize: 10,
          lineHeight: 16,
          letterSpacing: 1.4,
          color: C.textOnInkDim,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        —— Live transcript
      </Text>

      <TranscriptArea
        status={ctx.status}
        transcript={ctx.transcript}
        error={ctx.error}
      />

      {ctx.status === 'reviewing' && (
        <SubmitButton onPress={() => dispatch({ type: 'SUBMIT' })} />
      )}

      {ctx.status === 'processing' && <ProcessingHint />}

      {ctx.status === 'ready' && ctx.parsed.length > 0 && (
        <ParsedList
          items={ctx.parsed}
          defaultCurrency={defaultCurrency}
          rates={rates}
          onEdit={editItem}
          onRemove={(id) => dispatch({ type: 'REMOVE_ITEM', id })}
          onConfirm={commit}
        />
      )}

      {ctx.status === 'empty' && (
        <RetryButton onPress={() => dispatch({ type: 'RESET' })} />
      )}
    </View>
  );
};

type TranscriptAreaProps = {
  status: ReturnType<typeof useVoiceMachine>['ctx']['status'];
  transcript: string;
  error: string | null;
};

const TranscriptArea = ({ status, transcript, error }: TranscriptAreaProps) => {
  if (status === 'error' && error) {
    return (
      <Text
        style={{
          fontFamily: FONTS.serifItalic,
          fontSize: 18,
          lineHeight: 26,
          color: C.textOnInkDim,
        }}
      >
        {error}
      </Text>
    );
  }

  if (transcript) {
    return (
      <Text
        style={{
          fontFamily: FONTS.serif,
          fontSize: 22,
          lineHeight: 30,
          color: C.textOnInk,
        }}
      >
        "{transcript}"
      </Text>
    );
  }

  if (status === 'listening') {
    return (
      <Text
        style={{
          fontFamily: FONTS.serifItalic,
          fontSize: 22,
          lineHeight: 29,
          color: C.textOnInkDim,
        }}
      >
        Listening for your transaction…
      </Text>
    );
  }

  return null;
};

const ProcessingHint = () => (
  <Text
    className="mt-3"
    style={{
      fontFamily: FONTS.monoSemi,
      fontSize: 10,
      lineHeight: 16,
      letterSpacing: 1.4,
      color: C.textOnInkDim,
      textTransform: 'uppercase',
    }}
  >
    ● Processing · GPT-4o
  </Text>
);

const SubmitButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    className="mt-6 h-12 items-center justify-center active:opacity-85"
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
      Submit transcript
    </Text>
  </Pressable>
);

const RetryButton = ({ onPress }: { onPress: () => void }) => (
  <View className="mt-3 items-center">
    <Text
      style={{
        fontFamily: FONTS.mono,
        fontSize: 12,
        lineHeight: 18,
        color: C.textOnInkDim,
        marginBottom: 12,
      }}
    >
      Couldn't extract anything.
    </Text>
    <Pressable
      onPress={onPress}
      className="h-11 px-6 items-center justify-center active:opacity-85"
      style={{
        borderWidth: 1,
        borderColor: C.inkLine,
      }}
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
        Try again
      </Text>
    </Pressable>
  </View>
);

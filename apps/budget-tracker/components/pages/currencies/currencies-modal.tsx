import { Header } from '@/components/common/header';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { Eyebrow } from '@/components/ui/typography';
import { useAllCurrencies } from '@/hooks/currencies/useAllCurrencies';
import { useCurrencyStore } from '@/store/currency';
import { useModalsStore } from '@/store/modals';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  InteractionManager,
  ListRenderItem,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CurrencyItem } from './currency-item';
import { useSortedCurrencies } from '@/hooks/currencies/useSortCurrencies';
import { Icon } from '@/components/ui/icon';
import { Search } from 'lucide-react-native';
import { C, FONTS } from '@/utils/theme';

const ITEM_HEIGHT = 49;

export const CurrenciesModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const [search, setSearch] = useState('');
  const { data: currencies } = useAllCurrencies();
  const { currenciesModalOpen, setCurrenciesModalOpen } = useModalsStore();
  const currency = useCurrencyStore((s) => s.currency);
  const favoriteCurrencies = useCurrencyStore((s) => s.favoriteCurrencies);

  const { favorites, all } = useSortedCurrencies(currencies, search);
  const favoriteSet = useMemo(
    () => new Set(favoriteCurrencies),
    [favoriteCurrencies]
  );

  const handleCurrencyClick = useCallback((currencyCode: string) => {
    modalRef.current?.close();
    InteractionManager.runAfterInteractions(() => {
      const store = useCurrencyStore.getState();
      if (!store.favoriteCurrencies.includes(currencyCode)) {
        store.addFavoriteCurrency(currencyCode);
      }
      store.setCurrency(currencyCode);
      setSearch('');
    });
  }, []);

  const handleFavoriteClick = useCallback((currencyCode: string) => {
    const store = useCurrencyStore.getState();
    if (store.favoriteCurrencies.includes(currencyCode)) {
      store.removeFavoriteCurrency(currencyCode);
    } else {
      store.addFavoriteCurrency(currencyCode);
    }
  }, []);

  const totalCount = currencies ? Object.keys(currencies).length : 0;

  const renderItem: ListRenderItem<[string, string]> = useCallback(
    ({ item, index }) => {
      const [code, name] = item;
      return (
        <View style={{ backgroundColor: C.paperHi }}>
          <CurrencyItem
            currencyCode={code}
            currencyName={name}
            isFavorite={favoriteSet.has(code)}
            isSelected={code === currency}
            onSelect={handleCurrencyClick}
            onToggleFavorite={handleFavoriteClick}
            isLast={index === all.length - 1}
          />
        </View>
      );
    },
    [
      favoriteSet,
      currency,
      all.length,
      handleCurrencyClick,
      handleFavoriteClick,
    ]
  );

  const ListHeader = (
    <>
      {favorites.length > 0 && (
        <>
          <View className="px-6 pt-3 pb-1.5">
            <Eyebrow>★ Your Favorites · {favorites.length}</Eyebrow>
          </View>
          <View
            style={{
              backgroundColor: C.paperHi,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: C.rule,
            }}
          >
            {favorites.map(([code, name], i) => (
              <CurrencyItem
                key={code}
                currencyCode={code}
                currencyName={name}
                isFavorite={favoriteSet.has(code)}
                isSelected={code === currency}
                onSelect={handleCurrencyClick}
                onToggleFavorite={handleFavoriteClick}
                isLast={i === favorites.length - 1}
              />
            ))}
          </View>
        </>
      )}

      {all.length > 0 && (
        <View
          className="px-6 pt-3.5 pb-1.5"
          style={{ backgroundColor: C.paper }}
        >
          <Eyebrow>All Currencies · {all.length}</Eyebrow>
        </View>
      )}

      {all.length > 0 && (
        <View
          style={{
            height: 1,
            backgroundColor: C.rule,
          }}
        />
      )}
    </>
  );

  const ListFooter =
    favorites.length === 0 && all.length === 0 ? (
      <View className="items-center py-16">
        <Text style={{ color: C.textMuted, fontSize: 13 }}>
          No currencies match.
        </Text>
      </View>
    ) : (
      <View className="px-6 pt-5 pb-2 items-center">
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            letterSpacing: 1.6,
            color: C.textMute,
            textTransform: 'uppercase',
          }}
        >
          Rates · @fawazahmed0/currency-api
        </Text>
      </View>
    );

  return (
    <ModalBase
      isOpen={currenciesModalOpen}
      onClose={() => setCurrenciesModalOpen(false)}
      ref={modalRef}
    >
      <Header
        title="CURRENCIES"
        closeButtonAction={() => modalRef.current?.close()}
        isModal
      />

      <View className="px-6 pt-3.5 pb-2">
        <View
          className="flex-row items-center gap-2.5 px-3.5 py-2.5"
          style={{
            backgroundColor: C.paperHi,
            borderWidth: 1,
            borderColor: C.ink,
          }}
        >
          <Icon icon={Search} size={14} color={C.text} strokeWidth={1.6} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor={C.textMute}
            autoCapitalize="characters"
            autoCorrect={false}
            className="flex-1 p-0"
            style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              color: C.text,
            }}
          />
          <Text
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 10,
              letterSpacing: 1,
              color: C.textMute,
            }}
          >
            {totalCount} RESULTS
          </Text>
        </View>
      </View>

      <FlatList
        data={all}
        keyExtractor={(item) => item[0]}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={16}
        windowSize={7}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </ModalBase>
  );
};

import { Header } from '@/components/common/header';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { useAllCurrencies } from '@/hooks/currencies/useAllCurrencies';
import { useCurrencyStore } from '@/store/currency';
import { useModalsStore } from '@/store/modals';
import { useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { CurrencyItem } from './currency-item';
import { useSortedCurrencies } from '@/hooks/currencies/useSortCurrencies';
import { Input } from '@/components/ui/input/input';
import { Icon } from '@/components/ui/icon';
import { Search } from 'lucide-react-native';
import { ScrollViewWithFade } from '@/components/ui/scroll-view-with-fade';

export const CurrenciesModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const [search, setSearch] = useState('');
  const { data: currencies } = useAllCurrencies();
  const { currenciesModalOpen, setCurrenciesModalOpen } = useModalsStore();
  const {
    currency,
    favoriteCurrencies,
    removeFavoriteCurrency,
    setCurrency,
    addFavoriteCurrency,
  } = useCurrencyStore();

  const { favorites, all } = useSortedCurrencies(currencies, search);

  const handleCurrencyClick = (currencyCode: string) => {
    if (!favoriteCurrencies.includes(currencyCode)) {
      addFavoriteCurrency(currencyCode);
    }
    setCurrency(currencyCode);
    setSearch('');
    modalRef.current?.close();
  };

  const handleFavoriteClick = (currencyCode: string) => {
    if (favoriteCurrencies.includes(currencyCode)) {
      removeFavoriteCurrency(currencyCode);
    } else {
      addFavoriteCurrency(currencyCode);
    }
  };

  return (
    <ModalBase
      isOpen={currenciesModalOpen}
      onClose={() => setCurrenciesModalOpen(false)}
      ref={modalRef}
      className="relative"
    >
      <Header
        title="Currencies"
        closeButtonAction={() => modalRef.current?.close()}
        isModal={true}
      />
      <ScrollViewWithFade enableFade className="pt-20">
        <FlatList
          ListHeaderComponent={() => (
            <Text className="text-secondary-text">Favorites</Text>
          )}
          data={favorites}
          style={{ marginBottom: 10 }}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 2 }}
          renderItem={({ item }) => {
            const [currencyCode, currencyName] = item;
            const isFavorite = favoriteCurrencies.includes(currencyCode);

            const isSelected = currencyCode === currency;
            return (
              <CurrencyItem
                currencyCode={currencyCode}
                currencyName={currencyName}
                isFavorite={isFavorite}
                isSelected={isSelected}
                onClick={() => handleCurrencyClick(currencyCode)}
                onFavoriteClick={() => handleFavoriteClick(currencyCode)}
              />
            );
          }}
        />

        <FlatList
          ListHeaderComponent={() => (
            <Text className="text-secondary-text">All</Text>
          )}
          data={all}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 2 }}
          renderItem={({ item }) => {
            const [currencyCode, currencyName] = item;
            const isFavorite = favoriteCurrencies.includes(currencyCode);

            const isSelected = currencyCode === currency;
            return (
              <CurrencyItem
                currencyCode={currencyCode}
                currencyName={currencyName}
                isFavorite={isFavorite}
                isSelected={isSelected}
                onClick={() => handleCurrencyClick(currencyCode)}
                onFavoriteClick={() => handleFavoriteClick(currencyCode)}
              />
            );
          }}
        />
      </ScrollViewWithFade>
      <View className="absolute bottom-6 left-6 right-6">
        <Input
          icon={<Icon icon={Search} className="text-white size-5" />}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </ModalBase>
  );
};

import { Header } from '@/components/common/header';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { Eyebrow } from '@/components/ui/typography';
import { Icon } from '@/components/ui/icon';
import { LANGUAGES } from '@/constants/languages';
import { useModalsStore } from '@/store/modals';
import { useSettingsStore } from '@/store/settings';
import { Search } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  InteractionManager,
  ListRenderItem,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LanguageItem } from './language-item';
import { C, FONTS } from '@/utils/theme';

const ITEM_HEIGHT = 49;

export const LanguagesModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const [search, setSearch] = useState('');
  const { languagesModalOpen, setLanguagesModalOpen } = useModalsStore();
  const voiceLocale = useSettingsStore((s) => s.voiceLocale);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = useCallback((code: string) => {
    modalRef.current?.close();
    InteractionManager.runAfterInteractions(() => {
      useSettingsStore.getState().setVoiceLocale(code);
      setSearch('');
    });
  }, []);

  const renderItem: ListRenderItem<(typeof LANGUAGES)[number]> = useCallback(
    ({ item, index }) => (
      <View style={{ backgroundColor: C.paperHi }}>
        <LanguageItem
          code={item.code}
          name={item.name}
          nativeName={item.nativeName}
          isSelected={item.code === voiceLocale}
          onSelect={handleSelect}
          isLast={index === filtered.length - 1}
        />
      </View>
    ),
    [voiceLocale, filtered.length, handleSelect]
  );

  const ListHeader = (
    <>
      {filtered.length > 0 && (
        <View
          className="px-6 pt-3.5 pb-1.5"
          style={{ backgroundColor: C.paper }}
        >
          <Eyebrow>Voice Languages · {filtered.length}</Eyebrow>
        </View>
      )}
      {filtered.length > 0 && (
        <View style={{ height: 1, backgroundColor: C.rule }} />
      )}
    </>
  );

  const ListFooter =
    filtered.length === 0 ? (
      <View className="items-center py-16">
        <Text style={{ color: C.textMuted, fontSize: 13, lineHeight: 18 }}>
          No languages match.
        </Text>
      </View>
    ) : (
      <View className="px-6 pt-5 pb-2 items-center">
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.6,
            color: C.textMute,
            textTransform: 'uppercase',
          }}
        >
          Used by · expo-speech-recognition
        </Text>
      </View>
    );

  return (
    <ModalBase
      isOpen={languagesModalOpen}
      onClose={() => setLanguagesModalOpen(false)}
      ref={modalRef}
    >
      <Header
        title="VOICE LANGUAGE"
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
            autoCorrect={false}
            className="flex-1 p-0"
            style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              lineHeight: 18,
              color: C.text,
            }}
          />
          <Text
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 10,
              lineHeight: 16,
              letterSpacing: 1,
              color: C.textMute,
            }}
          >
            {LANGUAGES.length} TOTAL
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={16}
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

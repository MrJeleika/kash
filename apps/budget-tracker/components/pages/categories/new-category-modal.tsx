import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { useEffect, useRef, useState } from 'react';
import { useModalsStore } from '@/store/modals';
import { Pressable, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { SelectColor } from './select-color';
import { IconPickerList } from './select-icon';
import { CategoryIcon } from '@/components/common/category-icon';
import { useCategoriesStore } from '@/store/categories';
import { TransactionType } from '@/types/transactions';
import { C, FONTS } from '@/utils/theme';

const NAME_LIMIT = 24;
const DEFAULT_COLOR = '#FF0000';
const DEFAULT_ICON = 'CircleSlash';

export const NewCategoryModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const {
    addCategoryModalOpen,
    setAddCategoryModalOpen,
    setCategoryToEdit,
    categoryToEdit,
  } = useModalsStore();

  const { addCategory, updateCategory } = useCategoriesStore();

  const [type, setType] = useState<TransactionType>(
    categoryToEdit?.type || 'expense'
  );
  const [icon, setIcon] = useState<string>(
    categoryToEdit?.icon || DEFAULT_ICON
  );
  const [color, setColor] = useState<string>(
    categoryToEdit?.color || DEFAULT_COLOR
  );
  const [name, setName] = useState<string>(categoryToEdit?.name || '');

  useEffect(() => {
    if (addCategoryModalOpen) {
      setType(categoryToEdit?.type || 'expense');
      setIcon(categoryToEdit?.icon || DEFAULT_ICON);
      setColor(categoryToEdit?.color || DEFAULT_COLOR);
      setName(categoryToEdit?.name || '');
    }
  }, [addCategoryModalOpen, categoryToEdit]);

  const handleClose = () => {
    modalRef.current?.close();
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (categoryToEdit) {
      updateCategory(categoryToEdit.name, { name, color, type, icon });
    } else {
      addCategory({ name, color, type, icon });
    }
    modalRef.current?.close();
  };

  const canSave = !!name.trim() && !!color && !!icon;
  const previewCategory = { name, color, type, icon };

  const listHeader = (
    <View>
      {/* Identity row — preview + name */}
      <View
        className="flex-row items-center px-6 pt-4 pb-4 gap-3.5"
        style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
      >
        <CategoryIcon category={previewCategory} size={64} />
        <View className="flex-1">
          <Text
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 10,
              lineHeight: 16,
              letterSpacing: 1.4,
              color: C.textMuted,
              marginBottom: 4,
            }}
          >
            NAME
          </Text>
          <TextInput
            value={name}
            onChangeText={(t) => t.length <= NAME_LIMIT && setName(t)}
            placeholder="Category"
            placeholderTextColor={C.textMute}
            autoCapitalize="words"
            style={{
              fontFamily: FONTS.serif,
              fontSize: 26,
              lineHeight: 34,
              color: C.ink,
              letterSpacing: -0.3,
              padding: 0,
              paddingTop: 0,
              paddingBottom: 0,
            }}
          />
          <Text
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 10,
              lineHeight: 16,
              color: C.textMuted,
              marginTop: 4,
              letterSpacing: 0.6,
            }}
          >
            {name.length} / {NAME_LIMIT} CHARS
          </Text>
        </View>
      </View>

      {/* Type segmented */}
      <View className="px-6 pt-3.5 pb-3">
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.4,
            color: C.textMuted,
            marginBottom: 8,
          }}
        >
          TYPE
        </Text>
        <View
          className="flex-row p-[3px]"
          style={{
            backgroundColor: C.paperHi,
            borderWidth: 1,
            borderColor: C.rule,
          }}
        >
          {(['expense', 'income'] as TransactionType[]).map((k) => {
            const active = type === k;
            return (
              <Pressable
                key={k}
                onPress={() => setType(k)}
                className="flex-1 items-center justify-center py-2.5"
                style={{ backgroundColor: active ? C.ink : 'transparent' }}
              >
                <Text
                  style={{
                    fontFamily: active ? FONTS.monoBold : FONTS.monoSemi,
                    fontSize: 11,
                    lineHeight: 17,
                    letterSpacing: 1.98,
                    color: active ? C.textOnInk : C.textMuted,
                  }}
                >
                  {k.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Color */}
      <View className="pt-2 pb-2">
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.4,
            color: C.textMuted,
            paddingHorizontal: 24,
            marginBottom: 10,
          }}
        >
          COLOR
        </Text>
        <SelectColor color={color} setColor={setColor} />
      </View>

      {/* Icon section label */}
      <View className="pt-3 pb-1">
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.4,
            color: C.textMuted,
            paddingHorizontal: 24,
            marginBottom: 4,
          }}
        >
          ICON
        </Text>
      </View>
    </View>
  );

  return (
    <ModalBase
      isOpen={addCategoryModalOpen}
      ref={modalRef}
      onClose={() => {
        setAddCategoryModalOpen(false);
        setCategoryToEdit(null);
      }}
    >
      {/* Custom header with red SAVE on right */}
      <View
        className="flex-row items-center justify-between px-5 pt-3 pb-3"
        style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
      >
        <Pressable onPress={handleClose} hitSlop={10}>
          <Icon icon={X} size={20} color={C.ink} />
        </Pressable>
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 12,
            lineHeight: 18,
            letterSpacing: 2.16,
            color: C.ink,
          }}
        >
          {categoryToEdit ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
        </Text>
        <Pressable
          onPress={canSave ? handleSave : undefined}
          hitSlop={10}
          style={{ opacity: canSave ? 1 : 0.4 }}
        >
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 11,
              lineHeight: 17,
              letterSpacing: 1.4,
              color: C.red,
            }}
          >
            SAVE
          </Text>
        </Pressable>
      </View>

      <IconPickerList
        iconName={icon}
        setIconName={setIcon}
        color={color}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </ModalBase>
  );
};

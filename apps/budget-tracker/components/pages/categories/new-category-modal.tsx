import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { useEffect, useRef, useState } from 'react';
import { useModalsStore } from '@/store/modals';
import { Header } from '@/components/common/header';
import { View } from 'react-native';
import { SelectTransactionType } from '@/components/common/select-transaction-type';
import { Input } from '@/components/ui/input/input';
import { SelectColor } from './select-color';
import { CircleSlash, LucideIcon, Pencil } from 'lucide-react-native';
import { CategoryIcon } from '@/components/common/category-icon';
import { Button } from '@/components/ui/button/button';
import { SelectIcon } from './select-icon';
import { useCategoriesStore } from '@/store/categories';
import { TransactionType } from '@/types/transactions';

export const NewCategoryModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const {
    addCategoryModalOpen,
    setAddCategoryModalOpen,
    setCategoryToEdit,
    categoryToEdit,
  } = useModalsStore();

  const { addCategory } = useCategoriesStore();

  const [type, setType] = useState<TransactionType>(
    categoryToEdit?.type || 'expense'
  );
  const [icon, setIcon] = useState<LucideIcon>(
    categoryToEdit?.icon || CircleSlash
  );
  const [color, setColor] = useState<string>(
    categoryToEdit?.color || '#ffffff'
  );
  const [name, setName] = useState<string>(categoryToEdit?.name || '');

  useEffect(() => {
    if (addCategoryModalOpen) {
      setType(categoryToEdit?.type || 'expense');
      setIcon(categoryToEdit?.icon || CircleSlash);
      setColor(categoryToEdit?.color || '#ffffff');
      setName(categoryToEdit?.name || '');
    }
  }, [addCategoryModalOpen, categoryToEdit]);

  const handleClose = () => {
    setCategoryToEdit(null);
    modalRef.current?.close();
  };

  const handleSave = () => {
    addCategory({ name, color, type, icon });
    setAddCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  return (
    <ModalBase
      isOpen={addCategoryModalOpen}
      ref={modalRef}
      onClose={() => {
        setAddCategoryModalOpen(false);
        setCategoryToEdit(null);
      }}
    >
      <Header title="New Category" closeButtonAction={handleClose} />
      <View className="pt-28 pb-4 flex w-full items-center justify-center gap-5 h-full">
        <View className="flex flex-col flex-1 h-full  items-center gap-2">
          <Input
            icon={
              <CategoryIcon
                category={{
                  name,
                  color: color,
                  type,
                  icon,
                }}
              />
            }
            iconClassName="left-2"
            value={name}
            onChangeText={setName}
            placeholder="Category name"
            className="rounded-xl w-[65vw] py-5 text-lg leading-none !pl-16"
          />
          <SelectTransactionType type={type} setType={setType} />
        </View>
        <SelectColor color={color} setColor={setColor} />
        <SelectIcon icon={icon} setIcon={setIcon} />
        <Button
          size="cta"
          text="cta"
          onPress={handleSave}
          disabled={!name || !color || !icon}
        >
          Save
        </Button>
      </View>
    </ModalBase>
  );
};

import { Header } from '@/components/common/header';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { SelectTransactionType } from '@/components/common/select-transaction-type';
import { Button } from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon';
import { useModalsStore } from '@/store/modals';
import { Plus } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { CategoryItem } from './category-item';
import { useCategoriesStore } from '@/store/categories';

export const CategoriesModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const {
    categoriesModalOpen,
    setCategoriesModalOpen,
    setAddCategoryModalOpen,
  } = useModalsStore();

  const { categories } = useCategoriesStore();

  const [type, setType] = useState<'income' | 'expense'>('income');
  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleClose = () => {
    modalRef.current?.close();
  };

  return (
    <ModalBase
      className="px-0"
      isOpen={categoriesModalOpen}
      ref={modalRef}
      onClose={() => setCategoriesModalOpen(false)}
    >
      <Header
        title="Categories"
        closeButtonAction={handleClose}
        actionButton={
          <Button
            variant="secondary"
            onPress={() => setAddCategoryModalOpen(true)}
            className="rounded-full w-10 h-10 items-center justify-center"
          >
            <Icon icon={Plus} className="text-text size-7" />
          </Button>
        }
      />
      <View className="pt-28 flex w-full  items-center justify-center gap-5">
        <SelectTransactionType type={type} setType={setType} />

        <FlatList
          className="w-full"
          data={filteredCategories}
          renderItem={({ item, index }) => (
            <CategoryItem category={item} index={index} />
          )}
          keyExtractor={(item) => item.name}
          contentContainerClassName="gap-0.5  pb-16"
        />
      </View>
    </ModalBase>
  );
};

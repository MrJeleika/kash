import React, { memo, useCallback } from 'react';
import { CATEGORY_ICONS } from '@/constants/category-icons';
import { Icon } from '@/components/ui/icon';
import { View, Pressable, Text, FlatList, ListRenderItem } from 'react-native';
import { getIconName } from '@/utils/icon-registry';
import { LucideIcon } from 'lucide-react-native';
import { C, FONTS } from '@/utils/theme';

const COLUMNS = 6;
const TILE_GAP = 6;
const ROW_HEIGHT = 70;
const HEADER_HEIGHT = 33;

interface PreparedIcon {
  icon: LucideIcon;
  name: string;
  registryName: string;
}

type ListItem =
  | { kind: 'header'; key: string; category: string }
  | { kind: 'row'; key: string; icons: PreparedIcon[] };

const ICON_LIST_DATA: ListItem[] = (() => {
  const out: ListItem[] = [];
  for (const group of CATEGORY_ICONS) {
    out.push({
      kind: 'header',
      key: `h:${group.category}`,
      category: group.category,
    });
    for (let i = 0; i < group.icons.length; i += COLUMNS) {
      const slice = group.icons.slice(i, i + COLUMNS).map((opt) => ({
        icon: opt.icon,
        name: opt.name,
        registryName: getIconName(opt.icon),
      }));
      out.push({
        kind: 'row',
        key: `r:${group.category}:${i}`,
        icons: slice,
      });
    }
  }
  return out;
})();

interface TileProps {
  icon: LucideIcon;
  registryName: string;
  isSelected: boolean;
  color: string;
  onSelect: (name: string) => void;
}

const IconTile = memo(
  ({ icon, registryName, isSelected, color, onSelect }: TileProps) => (
    <View
      style={{
        width: `${100 / COLUMNS}%`,
        paddingHorizontal: TILE_GAP / 2,
        paddingVertical: TILE_GAP / 2,
      }}
    >
      <Pressable
        onPress={() => onSelect(registryName)}
        style={{
          aspectRatio: 1,
          alignSelf: 'stretch',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isSelected ? color : 'transparent',
          borderWidth: 1,
          borderColor: isSelected ? color : C.rule,
        }}
      >
        <Icon
          icon={icon}
          size={20}
          color={isSelected ? '#FFFFFF' : C.text}
          strokeWidth={1.6}
        />
      </Pressable>
    </View>
  )
);
IconTile.displayName = 'IconTile';

interface RowProps {
  icons: PreparedIcon[];
  iconName: string;
  color: string;
  onSelect: (name: string) => void;
}

const IconRow = memo(({ icons, iconName, color, onSelect }: RowProps) => (
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 24 - TILE_GAP / 2,
      paddingVertical: TILE_GAP / 2,
    }}
  >
    {icons.map((opt) => (
      <IconTile
        key={opt.name}
        icon={opt.icon}
        registryName={opt.registryName}
        isSelected={opt.registryName === iconName}
        color={color}
        onSelect={onSelect}
      />
    ))}
  </View>
));
IconRow.displayName = 'IconRow';

const GroupHeader = memo(({ category }: { category: string }) => (
  <Text
    style={{
      fontFamily: FONTS.monoSemi,
      fontSize: 11,
      lineHeight: 17,
      color: C.textMuted,
      letterSpacing: 0.6,
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 8,
    }}
  >
    {category}
  </Text>
));
GroupHeader.displayName = 'GroupHeader';

interface IconPickerListProps {
  iconName: string;
  setIconName: (name: string) => void;
  color: string;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  contentContainerStyle?: any;
}

export const IconPickerList = ({
  iconName,
  setIconName,
  color,
  ListHeaderComponent,
  contentContainerStyle,
}: IconPickerListProps) => {
  const renderItem = useCallback<ListRenderItem<ListItem>>(
    ({ item }) => {
      if (item.kind === 'header') {
        return <GroupHeader category={item.category} />;
      }
      return (
        <IconRow
          icons={item.icons}
          iconName={iconName}
          color={color}
          onSelect={setIconName}
        />
      );
    },
    [iconName, color, setIconName]
  );

  return (
    <FlatList
      data={ICON_LIST_DATA}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
      initialNumToRender={6}
      windowSize={5}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews
      getItemLayout={getItemLayout}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const keyExtractor = (item: ListItem) => item.key;

const getItemLayout = (data: ArrayLike<ListItem> | null | undefined, index: number) => {
  let offset = 0;
  const list = data as ListItem[] | null | undefined;
  if (!list) return { length: ROW_HEIGHT, offset: index * ROW_HEIGHT, index };
  for (let i = 0; i < index; i++) {
    offset += list[i].kind === 'header' ? HEADER_HEIGHT : ROW_HEIGHT;
  }
  const length =
    list[index]?.kind === 'header' ? HEADER_HEIGHT : ROW_HEIGHT;
  return { length, offset, index };
};


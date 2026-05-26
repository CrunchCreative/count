// HScroll — horizontal FlatList wrapper that breaks out of the parent's
// horizontal padding so cards scroll edge-to-edge of the screen.
//
// Uses the margin-out / padding-in trick: the negative marginHorizontal
// cancels the parent's paddingHorizontal, then contentContainerStyle.paddingHorizontal
// re-applies it inside the scroll area so the first/last cards have visual gutter.
//
// Important: the negative margin value must match the Dashboard's PAGE_X
// (currently 12). If page padding changes, update GUTTER here.

import type { ReactElement } from 'react';
import { FlatList, View, type ListRenderItem } from 'react-native';

export interface HScrollProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  keyExtractor: (item: T) => string;
}

const GUTTER = 12;

export function HScroll<T>({ data, renderItem, keyExtractor }: HScrollProps<T>): ReactElement {
  const render: ListRenderItem<T> = ({ item, index }) => renderItem(item, index);

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={keyExtractor}
      renderItem={render}
      ItemSeparatorComponent={Separator}
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -GUTTER }}
      contentContainerStyle={{ paddingHorizontal: GUTTER }}
      accessibilityRole="list"
    />
  );
}

function Separator() {
  return <View style={{ width: 10 }} />;
}
# react-native-legend-reorderable-list

A reorderable list for React Native applications, powered by LegendList and Reanimated 🚀

## Features

- Drag & Drop with LegendList
- Vertical & Horizontal Mode
- Layout Animations
- Custom Animations
- Drop Indicator
- Powered by @legendapp/list and react-native-reanimated

## Install

```bash
npm install react-native-legend-reorderable-list
```

Or

```bash
yarn add react-native-legend-reorderable-list
```

Then you need to install these peer dependencies:

- [LegendList](https://www.legendapp.com/open-source/list/) >= 2.0.0
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated) >= 3.12.0 (recommended: 4.x)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler) >= 2.20.0

## Usage

```tsx
import React, { useState, memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LegendList } from '@legendapp/list';
import ReorderableList, { reorderItems, useReorderableDrag } from 'react-native-legend-reorderable-list';

interface CardProps {
  id: string;
  color: string;
  height: number;
}

const rand = () => Math.floor(Math.random() * 256);

const seedData: CardProps[] = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    color: `rgb(${rand()}, ${rand()}, ${rand()})`,
    height: Math.max(60, Math.floor(Math.random() * 100)),
  }));

const Card = memo<CardProps>(({ id, color, height }) => {
  const drag = useReorderableDrag();

  return (
    <Pressable style={[styles.card, { height }]} onLongPress={drag}>
      <Text style={[styles.text, { color }]}>Card {id}</Text>
    </Pressable>
  );
});

const Example = () => {
  const [data, setData] = useState(seedData);

  const handleReorder = ({ from, to }: { from: number; to: number }) => {
    setData((value) => reorderItems(value, from, to));
  };

  const renderItem = ({ item }: { item: CardProps }) => (
    <Card {...item} />
  );

  return (
    <LegendList
      data={data}
      onReorder={handleReorder}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      estimatedItemSize={80}
      recycleItems
    />
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 20,
  },
});

export default Example;
```

## License

MIT

Based on [react-native-reorderable-list](https://github.com/omahili/react-native-reorderable-list)

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

## Local Development / Testing

To test this package in a local React Native project without publishing:

### Option 1: npm link

```bash
# In this package's directory
cd react-native-legend-reorderable-list
npm link

# In your test project
npm link react-native-legend-reorderable-list
```

### Option 2: Yarn workspace

Add to your project's `package.json`:

```json
{
  "workspaces": {
    "packages": [
      "path/to/react-native-legend-reorderable-list"
    ]
  }
}
```

Then run `yarn install` in your project root.

### Option 3: Direct import

Copy the `src` folder into your project:

```bash
cp -r react-native-legend-reorderable-list/src your-project/src/components/
```

Then import directly:

```tsx
import { ReorderableList } from './components/ReorderableList';
```

### Required: Babel Config

Reanimated requires babel configuration. Add to your `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // Add this line
};
```

**Note:** If using reanimated v4, you may need `'react-native-worklets/plugin'` instead. Check reanimated docs for your version.

### Example Test Project

```bash
# Create a fresh RN project
npx react-native@latest init TestProject
cd TestProject

# Install dependencies
npm install @legendapp/list react-native-reanimated react-native-gesture-handler

# Link this package (using npm link or yarn workspace)
cd ../
npm link react-native-legend-reorderable-list

# Run the app
cd TestProject
npm start
# Then press 'a' for Android or 'i' for iOS
```

## License

MIT

Based on [react-native-reorderable-list](https://github.com/omahili/react-native-reorderable-list)

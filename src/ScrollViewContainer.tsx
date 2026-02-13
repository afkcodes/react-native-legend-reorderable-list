import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useAnimatedScrollHandler } from 'react-native-reanimated';

interface ScrollViewContainerProps extends ScrollViewProps {
  onScroll?: ReturnType<typeof useAnimatedScrollHandler>;
}

export function ScrollViewContainer({ onScroll, ...props }: ScrollViewContainerProps) {
  return (
    <ScrollView
      {...props}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
}

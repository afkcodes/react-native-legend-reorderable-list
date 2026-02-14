import React, { useCallback, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, Platform, LayoutAnimationConfig } from 'react-native';
import { LegendList } from '@legendapp/list';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedReaction,
  scrollTo,
  useAnimatedRef,
} from 'react-native-reanimated';

import type { ReorderableListProps, ReorderableListReorderEvent } from './types';
import { reorderItems } from './utils/reorderItems';

const AUTOSCROLL_THRESHOLD_DEFAULT = 0.1;
const AUTOSCROLL_SPEED_SCALE_DEFAULT = 1;
const ANIMATION_DURATION_DEFAULT = 200;

export function ReorderableList<T>({
  data,
  renderItem,
  keyExtractor,
  onReorder,
  renderDropIndicator,
  autoscrollThreshold = AUTOSCROLL_THRESHOLD_DEFAULT,
  autoscrollThresholdOffset = { start: 0, end: 0 },
  autoscrollSpeedScale = AUTOSCROLL_SPEED_SCALE_DEFAULT,
  autoscrollDelay = Platform.OS === 'android' ? 0 : 100,
  autoscrollActivationDelta = 5,
  animationDuration = ANIMATION_DURATION_DEFAULT,
  cellAnimations,
  itemLayoutAnimation,
  dragEnabled = true,
  shouldUpdateActiveItem = false,
  panGesture,
  onDragStart,
  onDragEnd,
  onIndexChange,
  onScroll,
  style,
  contentContainerStyle,
  estimatedItemSize = 100,
  recycleItems = false,
  numColumns = 1,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
  extraData,
  initialScrollIndex,
  onEndReached,
  onEndReachedThreshold,
  refreshing,
  onRefresh,
  ...rest
}: ReorderableListProps<T>) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  
  const scrollRef = useAnimatedRef<any>();
  const scrollOffset = useSharedValue(0);
  const scrollContentHeight = useSharedValue(0);
  const viewportHeight = useSharedValue(0);
  
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const activeItemIndex = useSharedValue(-1);
  
  const handleDragStart = useCallback((index: number) => {
    setActiveIndex(index);
    if (onDragStart) {
      onDragStart({ index });
    }
  }, [onDragStart]);
  
  const handleDragEnd = useCallback((from: number, to: number) => {
    setActiveIndex(null);
    setTargetIndex(null);
    if (onDragEnd) {
      onDragEnd({ from, to });
    }
    if (from !== to) {
      onReorder({ from, to });
    }
  }, [onDragEnd, onReorder]);
  
  const handleIndexChange = useCallback((from: number, to: number) => {
    setTargetIndex(to);
    if (onIndexChange) {
      onIndexChange({ from, to });
    }
  }, [onIndexChange]);

  const autoScroll = useSharedValue(0);
  
  const handleScroll = useCallback((event: any) => {
    scrollOffset.value = event.nativeEvent.contentOffset.y;
    scrollContentHeight.value = event.nativeEvent.contentSize.height;
    viewportHeight.value = event.nativeEvent.layoutMeasurement.height;
    if (onScroll) {
      onScroll(event);
    }
  }, [onScroll]);

  // Calculate which item should be at the current drag position
  const calculateTargetIndex = useCallback((absoluteY: number): number => {
    'worklet';
    const adjustedY = absoluteY - scrollOffset.value;
    let cumulativeHeight = 0;
    
    for (let i = 0; i < data.length; i++) {
      const itemSize = estimatedItemSize; // Simplified - should track actual sizes
      if (adjustedY >= cumulativeHeight && adjustedY < cumulativeHeight + itemSize) {
        return i;
      }
      cumulativeHeight += itemSize;
    }
    return data.length - 1;
  }, [data.length, estimatedItemSize]);

  // Auto-scroll while dragging
  useAnimatedReaction(
    () => isDragging.value,
    (dragging) => {
      if (dragging) {
        const threshold = viewportHeight.value * autoscrollThreshold;
        const scrollY = scrollOffset.value;
        const contentHeight = scrollContentHeight.value;
        const viewportH = viewportHeight.value;
        
        let scrollDelta = 0;
        
        // Scroll up
        if (scrollY <= threshold + autoscrollThresholdOffset.start) {
          scrollDelta = -autoscrollSpeedScale * 5;
        }
        // Scroll down
        else if (scrollY >= contentHeight - viewportH - threshold - autoscrollThresholdOffset.end) {
          scrollDelta = autoscrollSpeedScale * 5;
        }
        
        if (scrollDelta !== 0) {
          scrollTo(scrollRef, scrollY + scrollDelta, true);
        }
      }
    },
    [autoscrollThreshold, autoscrollSpeedScale]
  );

  const renderItemWrapper = useCallback(({ item, index }: { item: T; index: number }) => {
    const isActive = activeIndex === index;
    const isTarget = targetIndex === index;
    
    return (
      <ReorderableItem
        item={item}
        index={index}
        isActive={isActive}
        isTarget={isTarget}
        dragEnabled={dragEnabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onIndexChange={handleIndexChange}
        translateY={translateY}
        translateX={translateX}
        isDragging={isDragging}
        activeItemIndex={activeItemIndex}
        data={data}
        estimatedItemSize={estimatedItemSize}
        calculateTargetIndex={calculateTargetIndex}
        renderItem={renderItem}
        cellAnimations={cellAnimations}
        animationDuration={animationDuration}
      />
    );
  }, [activeIndex, targetIndex, dragEnabled, data, estimatedItemSize, renderItem, cellAnimations, animationDuration, handleDragStart, handleDragEnd, handleIndexChange]);

  return (
    <LegendList
      ref={scrollRef}
      data={data}
      renderItem={renderItemWrapper}
      keyExtractor={keyExtractor}
      style={style}
      contentContainerStyle={contentContainerStyle}
      estimatedItemSize={estimatedItemSize}
      recycleItems={recycleItems}
      numColumns={numColumns}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      extraData={{ ...extraData, activeIndex, targetIndex }}
      initialScrollIndex={initialScrollIndex}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      itemLayoutAnimation={itemLayoutAnimation}
      {...rest}
    />
  );
}

// Individual reorderable item component
interface ReorderableItemProps<T> {
  item: T;
  index: number;
  isActive: boolean;
  isTarget: boolean;
  dragEnabled: boolean;
  onDragStart: (index: number) => void;
  onDragEnd: (from: number, to: number) => void;
  onIndexChange: (from: number, to: number) => void;
  translateY: Animated.SharedValue<number>;
  translateX: Animated.SharedValue<number>;
  isDragging: Animated.SharedValue<boolean>;
  activeItemIndex: Animated.SharedValue<number>;
  data: T[];
  estimatedItemSize: number;
  calculateTargetIndex: (absoluteY: number) => number;
  renderItem: (info: { item: T; index: number }) => React.ReactElement;
  cellAnimations?: { opacity?: number; transform?: any[] };
  animationDuration: number;
}

function ReorderableItem<T>({
  item,
  index,
  isActive,
  isTarget,
  dragEnabled,
  onDragStart,
  onDragEnd,
  onIndexChange,
  translateY,
  translateX,
  isDragging,
  activeItemIndex,
  data,
  estimatedItemSize,
  calculateTargetIndex,
  renderItem,
  cellAnimations,
  animationDuration,
}: ReorderableItemProps<T>) {
  const itemPosition = useSharedValue(index * estimatedItemSize);
  const startPosition = useSharedValue(0);
  const currentIndex = useSharedValue(index);
  
  const gesture = useMemo(() => {
    if (!dragEnabled) return undefined;
    
    return Gesture.Pan()
      .activateAfterLongPress(200)
      .onStart(() => {
        isDragging.value = true;
        activeItemIndex.value = index;
        startPosition.value = itemPosition.value;
        runOnJS(onDragStart)(index);
      })
      .onUpdate((event) => {
        translateY.value = event.translationY;
        translateX.value = event.translationX;
        
        const newPosition = startPosition.value + event.translationY;
        const newIndex = Math.round(newPosition / estimatedItemSize);
        const clampedIndex = Math.max(0, Math.min(data.length - 1, newIndex));
        
        if (clampedIndex !== currentIndex.value) {
          const from = currentIndex.value;
          currentIndex.value = clampedIndex;
          runOnJS(onIndexChange)(from, clampedIndex);
        }
      })
      .onEnd((event) => {
        isDragging.value = false;
        translateY.value = withSpring(0);
        translateX.value = withSpring(0);
        
        const finalIndex = currentIndex.value;
        runOnJS(onDragEnd)(index, finalIndex);
        
        // Reset
        currentIndex.value = index;
        activeItemIndex.value = -1;
      });
  }, [dragEnabled, index, estimatedItemSize, data.length]);

  const animatedStyle = useAnimatedStyle(() => {
    const isBeingDragged = activeItemIndex.value === index;
    
    return {
      transform: [
        { translateY: isBeingDragged ? translateY.value : 0 },
        { translateX: isBeingDragged ? translateX.value : 0 },
        { scale: isBeingDragged ? 1.02 : 1 },
      ],
      zIndex: isBeingDragged ? 1000 : 1,
      opacity: cellAnimations?.opacity !== undefined && !isBeingDragged
        ? cellAnimations.opacity
        : 1,
    };
  });

  return (
    <GestureDetector gesture={gesture || Gesture.Pan()}>
      <Animated.View style={animatedStyle}>
        {renderItem({ item, index })}
      </Animated.View>
    </GestureDetector>
  );
}

export { ReorderableList as default };

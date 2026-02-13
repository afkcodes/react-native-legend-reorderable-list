import type { ListRenderItem, ViewStyle, StyleProp } from 'react-native';
import type { Gesture } from 'react-native-gesture-handler';
import type { LayoutAnimationConfig } from 'react-native-reanimated';

export interface ReorderableListReorderEvent {
  from: number;
  to: number;
}

export interface ReorderableListDragStartEvent {
  index: number;
}

export interface ReorderableListDragEndEvent {
  from: number;
  to: number;
}

export interface ReorderableListIndexChangeEvent {
  from: number;
  to: number;
}

export interface ReorderableListCellAnimations {
  opacity?: number;
  transform?: any[];
}

export type ReorderableListRenderItem<T> = ListRenderItem<T>;

export interface ReorderableListProps<T> {
  data: T[];
  renderItem: ReorderableListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  onReorder: (event: ReorderableListReorderEvent) => void;
  
  // Optional props
  renderDropIndicator?: ReorderableListRenderItem<T>;
  autoscrollThreshold?: number;
  autoscrollThresholdOffset?: { start?: number; end?: number };
  autoscrollSpeedScale?: number;
  autoscrollDelay?: number;
  autoscrollActivationDelta?: number;
  animationDuration?: number;
  cellAnimations?: ReorderableListCellAnimations;
  itemLayoutAnimation?: LayoutAnimationConfig;
  dragEnabled?: boolean;
  shouldUpdateActiveItem?: boolean;
  panGesture?: Gesture;
  onDragStart?: (event: ReorderableListDragStartEvent) => void;
  onDragEnd?: (event: ReorderableListDragEndEvent) => void;
  onIndexChange?: (event: ReorderableListIndexChangeEvent) => void;
  onScroll?: any;
  
  // Style props
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  
  // LegendList specific
  estimatedItemSize?: number;
  recycleItems?: boolean;
  numColumns?: number;
  
  // Other FlatList-compatible props
  ListEmptyComponent?: any;
  ListHeaderComponent?: any;
  ListFooterComponent?: any;
  ItemSeparatorComponent?: any;
  extraData?: any;
  initialScrollIndex?: number;
  onEndReached?: (info: { distanceFromEnd: number }) => void;
  onEndReachedThreshold?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
}

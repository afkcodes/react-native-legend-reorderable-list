import React from 'react';
import { StyleSheet } from 'react-native';
import { ReorderableList } from './ReorderableList';
import type { ReorderableListProps } from './types';

interface NestedReorderableListProps<T> extends ReorderableListProps<T> {
  scrollable?: boolean;
}

export function NestedReorderableList<T>({
  scrollable = false,
  style,
  ...props
}: NestedReorderableListProps<T>) {
  return (
    <ReorderableList
      {...props}
      style={[styles.nested, style]}
    />
  );
}

const styles = StyleSheet.create({
  nested: {
    flex: 1,
  },
});

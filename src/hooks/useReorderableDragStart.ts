import { useCallback } from 'react';
import type { ReorderableListDragStartEvent } from '../types';

interface UseReorderableDragStart {
  (callback: (index: number) => void): (index: number) => void;
}

export function useReorderableDragStart(callback: (index: number) => void): (index: number) => void {
  const handleDragStart = useCallback((index: number) => {
    'worklet';
    callback(index);
  }, [callback]);

  return handleDragStart;
}

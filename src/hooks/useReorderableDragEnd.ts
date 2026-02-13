import { useCallback } from 'react';

interface UseReorderableDragEnd {
  (callback: (from: number, to: number) => void): (from: number, to: number) => void;
}

export function useReorderableDragEnd(callback: (from: number, to: number) => void): (from: number, to: number) => void {
  const handleDragEnd = useCallback((from: number, to: number) => {
    'worklet';
    callback(from, to);
  }, [callback]);

  return handleDragEnd;
}

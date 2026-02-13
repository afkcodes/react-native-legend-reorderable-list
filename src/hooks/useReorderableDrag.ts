import { useCallback } from 'react';

interface UseReorderableDrag {
  (): () => void;
}

export function useReorderableDrag(): UseReorderableDrag {
  // This hook creates a function that triggers drag
  // In this implementation, the drag is handled by the parent ReorderableList
  // This hook is provided for API compatibility
  
  const triggerDrag = useCallback(() => {
    // The actual drag triggering is handled by the ReorderableList's pan gesture
    // This is for API compatibility with the original library
  }, []);

  return triggerDrag;
}

/**
 * Reorders items in an array from one index to another
 * @param data - The array of items
 * @param from - The index of the item to move
 * @param to - The destination index
 * @returns A new array with the items reordered
 */
export function reorderItems<T>(data: T[], from: number, to: number): T[] {
  const result = [...data];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

import { SortOrder } from './types/shared';

export const range = (start: number, end: number): number[] => {
  const nums = [];
  for (let i = start; i < end; i++) {
    nums.push(i);
  }
  return nums;
};

export const parseIntOrDefault = (x: any, defaultVal: number) => {
  if (typeof x === 'string') {
    const num = Number.parseInt(x, 10);
    return isNaN(num) ? defaultVal : num;
  }
  return defaultVal;
};

export const getSortOrderOrDefault = (
  sortOrder: any,
  defaultVal: SortOrder
): 'asc' | 'desc' =>
  sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : defaultVal;

import {
  SortOrder,
  Game,
  SortingAndPagination,
  SortedAndPaginatedData,
} from './types/shared';

// TODO: share with client
export const parseIntOrDefault = (x: any, defaultVal: number) => {
  if (typeof x === 'string') {
    const num = Number.parseInt(x, 10);
    return isNaN(num) ? defaultVal : num;
  }
  return defaultVal;
};

// TODO: share with client
export const getStringOrDefault = (x: any, defaultVal: string) =>
  typeof x === 'string' ? x : defaultVal;

// TODO: share with client
export const getSortOrderOrDefault = (
  sortOrder: any,
  defaultVal: SortOrder
): 'asc' | 'desc' =>
  sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : defaultVal;

// Sort and slice an array of objects.
// NOTE: This sorts the input array in place.
export function sortAndSlice<A>(
  arr: A[],
  options: SortingAndPagination<A>
): SortedAndPaginatedData<A> {
  const { sortField, start, size, sortOrder } = options;
  // Sort
  arr.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  // Limit results
  const arrSlice = arr.slice(start, start + size);
  const result = {
    data: arrSlice,
    sortField,
    sortOrder,
    start,
    size,
    numRecords: arrSlice.length,
    totalRecords: arr.length,
    filter: options.filter,
  };
  return result;
}

const filterNonAlphaNum = (x: string) =>
  x.replace('-', ' ').replace(/[^0-9A-Z ]/i, '');

export const tokenize = (x: string) =>
  filterNonAlphaNum(x).trim().toLowerCase().split(/\s+/);

type StringOrTokens = string | string[];

const getTokens = (x: StringOrTokens) =>
  typeof x === 'string' ? tokenize(x) : x;

/*
 * Take a search string or search tokens and a source string or source tokens
 * and checks if all the search tokens are in the source.
 */
export const searchByTokens = (
  search: StringOrTokens,
  source: StringOrTokens
) => {
  const searchTokens = getTokens(search);
  const sourceTokens = getTokens(source);
  return searchTokens.every((searchToken) =>
    sourceTokens.some((sourceToken) => sourceToken.includes(searchToken))
  );
};

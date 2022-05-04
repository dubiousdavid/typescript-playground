export interface Game {
  id: number;
  name: string;
  yearPublished: number;
  minPlayers: number;
  maxPlayers: number;
  playTime: number;
  minAge: number;
  countRatings: number;
  avgRating: number;
  rank: number;
  avgComplexity: number;
  countUsers: number;
  mechanics: string[];
  domains: string[];
}

export type SortOrder = 'asc' | 'desc';

export interface SortingAndPagination<A> {
  size: number;
  start: number;
  sortField: keyof A;
  sortOrder: SortOrder;
  filter: string;
}

export interface SortedAndPaginatedData<A> extends SortingAndPagination<A> {
  data: A[];
  numRecords: number;
  totalRecords: number;
}

export interface SortedAndPaginatedService<A> {
  fetch(options: SortingAndPagination<A>): Promise<SortedAndPaginatedData<A>>;
}

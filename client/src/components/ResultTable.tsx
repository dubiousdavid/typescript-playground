import React, { useEffect, useReducer } from 'react';
import {
  SortOrder,
  SortedAndPaginatedData,
  SortingAndPagination,
} from '../types/shared';
import { getSortOrderOrDefault, parseIntOrDefault, range } from '../util';

type Action<A> =
  | { type: 'changeSort'; sortField: keyof A }
  | { type: 'changeSize'; size: number }
  | { type: 'changePage'; page: number }
  | { type: 'changeFilter'; filter: string }
  | { type: 'handleResponse'; data: SortedAndPaginatedData<A> }
  | { type: 'handleError'; error: any };
interface State<A> extends SortedAndPaginatedData<A> {
  status: 'loading' | 'loaded' | 'error';
  error: any;
}
type Dispatch<A> = React.Dispatch<Action<A>>;
type ModifyStateProps<A> = { state: State<A>; dispatch: Dispatch<A> };
type Columns<A> = [string, keyof A][];
type ResultTableProps<A> = {
  endpoint: string;
  columns: Columns<A>;
  children: (x: A, i: number) => JSX.Element;
  sortingAndPagination: SortingAndPagination<A>;
};
type Reducer<A> = (state: State<A>, action: Action<A>) => State<A>;

function getSortArrow<A>(state: State<A>, col: keyof A): string {
  const { sortField, sortOrder } = state;
  if (sortField === col) {
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  }
  return '';
}

const pageSizes = [10, 25, 50];

function PageSize<A>({ state, dispatch }: ModifyStateProps<A>) {
  return (
    <>
      <span className="pageSize">Page Size:</span>
      <select
        value={state.size}
        onChange={(e) =>
          dispatch({
            type: 'changeSize',
            size: parseInt(e.target.value, 10),
          })
        }
      >
        {pageSizes.map((size) => (
          <option key={size}>{size}</option>
        ))}
      </select>
    </>
  );
}

function getPagination<A>(state: State<A>) {
  return {
    numPages: Math.ceil(state.totalRecords / state.size),
    currentPage: state.start / state.size + 1,
  };
}

function Pagination<A>({ state, dispatch }: ModifyStateProps<A>) {
  const { numPages, currentPage } = getPagination(state);
  console.debug('Current Page %d', currentPage);
  return (
    <>
      <span className="pages">
        {range(1, numPages + 1).map((x) => (
          <span
            key={x}
            className={x === currentPage ? 'page currentPage' : 'page'}
            onClick={() => dispatch({ type: 'changePage', page: x })}
          >
            {x}
          </span>
        ))}
      </span>
      <span className="divider">|</span>
      <span className="totalRecords">
        {state.start + 1} - {currentPage * state.size} of {state.totalRecords}
      </span>
    </>
  );
}

function stateToURLSearchParams<A>(state: State<A>): URLSearchParams {
  return new URLSearchParams({
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    size: state.size,
    start: state.start,
    filter: state.filter,
  } as Record<string, any>);
}

// NOTE: This replaces state instead of pushing to the history
function persistSearchToHistory(searchString: string) {
  const url = new URL(window.location.toString());
  url.search = searchString;
  console.debug('Persisting history %s', url.search);
  window.history.replaceState({}, '', url.toString());
}

const flipSortOrder = (sortOrder: SortOrder): SortOrder =>
  sortOrder === 'asc' ? 'desc' : 'asc';

function reducer<A>(state: State<A>, action: Action<A>): State<A> {
  console.debug('Reducer %o, %o', action, state);
  switch (action.type) {
    case 'changeSort':
      return {
        ...state,
        sortOrder:
          state.sortField === action.sortField
            ? flipSortOrder(state.sortOrder)
            : 'asc',
        sortField: action.sortField,
        status: 'loading',
      };
    case 'changeSize':
      return { ...state, start: 0, size: action.size, status: 'loading' };
    case 'changePage':
      return {
        ...state,
        start: (action.page - 1) * state.size,
        status: 'loading',
      };
    case 'changeFilter':
      return { ...state, start: 0, filter: action.filter };
    case 'handleResponse':
      const { data, numRecords, totalRecords } = action.data;
      return {
        ...state,
        data,
        numRecords,
        totalRecords,
        status: 'loaded',
        error: null,
      };
    case 'handleError':
      return { ...state, error: action.error, status: 'error' };
  }
}

function getInitState<A>(
  sortingAndPagination: SortingAndPagination<A>
): State<A> {
  const state: State<A> = {
    ...sortingAndPagination,
    data: [],
    status: 'loading',
    error: null,
    numRecords: 0,
    totalRecords: 0,
  };
  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    const { sortField, sortOrder, size, start, filter } = sortingAndPagination;
    return {
      ...state,
      sortField: (searchParams.get('sortField') || sortField) as keyof A,
      sortOrder: getSortOrderOrDefault(
        searchParams.get('sortOrder'),
        sortOrder
      ),
      size: parseIntOrDefault(searchParams.get('size'), size),
      start: parseIntOrDefault(searchParams.get('start'), start),
      filter: searchParams.get('filter') || filter,
    };
  }
  return state;
}

function ResultTable<A>(props: ResultTableProps<A>) {
  const { endpoint, columns, children, sortingAndPagination } = props;
  const [state, dispatch] = useReducer(
    reducer as Reducer<A>,
    // Load initial state from search params if present, otherwise sortingAndPagination
    getInitState(sortingAndPagination)
  );
  // Persist search state to history
  const searchString = stateToURLSearchParams(state).toString();
  useEffect(() => persistSearchToHistory(searchString), [searchString]);
  useEffect(() => {
    const url = `${endpoint}?${searchString}`;
    console.debug('Fetching %s', url);
    fetch(url)
      .then((response) => response.json())
      .then((response) =>
        dispatch({
          type: 'handleResponse',
          data: response as SortedAndPaginatedData<A>,
        })
      )
      .catch((error) => dispatch({ type: 'handleError', error }));
  }, [endpoint, searchString]);

  const { data: rows, status } = state;

  if (status === 'error') {
    console.error(state.error);
    return (
      <div>
        <span>Something went wrong...</span>
      </div>
    );
  }

  // TODO: handle loading status in UI
  if (status === 'loading' || status === 'loaded') {
    return (
      <div className="resultTable">
        <div className="topSection">
          <div className="pagination">
            <PageSize state={state} dispatch={dispatch} />
            <span className="divider">|</span>
            <Pagination state={state} dispatch={dispatch} />
          </div>
          <div className="filter">
            Filter by Name:{' '}
            <input
              type="text"
              onChange={(e) =>
                dispatch({ type: 'changeFilter', filter: e.target.value })
              }
              value={state.filter}
            />
          </div>
        </div>
        <table className={state.status}>
          <thead>
            <tr>
              {columns.map(([displayName, field]) => (
                <th
                  key={field.toString()}
                  onClick={() =>
                    dispatch({ type: 'changeSort', sortField: field })
                  }
                >
                  {displayName}
                  {getSortArrow(state, field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows.map(children)}</tbody>
        </table>
      </div>
    );
  }
  return null;
}

export default ResultTable;

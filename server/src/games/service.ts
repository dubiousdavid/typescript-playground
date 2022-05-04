// App
import { default as Games } from './data.json';
import { Game, SortedAndPaginatedService } from '../types/shared';
import { searchByTokens, tokenize, sortAndSlice } from '../util';

export const GameService: SortedAndPaginatedService<Game> = {
  async fetch(options) {
    console.debug('Options %O', options);
    // Filter
    const searchTokens = tokenize(options.filter);
    const filtered =
      options.filter.length > 0
        ? Games.filter(({ name }) => searchByTokens(searchTokens, name))
        : Games;
    const result = sortAndSlice(filtered, options);
    console.debug('Result %O', result);
    return Promise.resolve(result);
  },
};

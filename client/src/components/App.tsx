import React from 'react';
import '../App.css';
import { Game, SortingAndPagination } from '../types/shared';
import ResultTable from './ResultTable';
import config from '../config';

const columns: [string, keyof Game][] = [
  ['Rank', 'rank'],
  ['ID', 'id'],
  ['Name', 'name'],
  ['Published', 'yearPublished'],
  ['Players', 'maxPlayers'],
  ['Play Time', 'playTime'],
  ['Min Age', 'minAge'],
  ['Rating', 'avgRating'],
  ['Avg Complexity', 'avgComplexity'],
  ['Count Users', 'countUsers'],
  ['Mechanics', 'mechanics'],
  ['Domains', 'domains'],
];

const sortingAndPagination: SortingAndPagination<Game> = {
  size: 10,
  start: 0,
  sortField: 'rank',
  sortOrder: 'asc',
  filter: '',
};

const App: React.FC = () => (
  <ResultTable
    columns={columns}
    sortingAndPagination={sortingAndPagination}
    endpoint={`${config.apiOrigin}/games`}
  >
    {(g, i) => (
      <tr key={g.id} className={i % 2 === 0 ? 'alternateRow' : ''}>
        <td>{g.rank}</td>
        <td>{g.id}</td>
        <td>{g.name}</td>
        <td>{g.yearPublished}</td>
        <td>
          {g.minPlayers}-{g.maxPlayers}
        </td>
        <td>{g.playTime} min</td>
        <td>{g.minAge}</td>
        <td>{g.avgRating}</td>
        <td>{g.avgComplexity}</td>
        <td>{g.countUsers}</td>
        <td>{g.mechanics.join(', ')}</td>
        <td>{g.domains.join(', ')}</td>
      </tr>
    )}
  </ResultTable>
);

export default App;

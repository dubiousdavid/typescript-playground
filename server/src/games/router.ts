// Lib
import { Request, Response, Router } from 'express';
// App
import { GameService } from './service';
import {
  parseIntOrDefault,
  getStringOrDefault,
  getSortOrderOrDefault,
} from '../util';
import { Game } from '../types/shared';

export const gamesRouter = Router();

gamesRouter.get('/', async (req: Request, res: Response) => {
  const { size, start, sortField, sortOrder, filter } = req.query;
  try {
    const games = await GameService.fetch({
      size: parseIntOrDefault(size, 10),
      start: parseIntOrDefault(start, 0),
      sortField: getStringOrDefault(sortField, 'rank') as keyof Game,
      sortOrder: getSortOrderOrDefault(sortOrder, 'asc'),
      filter: getStringOrDefault(filter, ''),
    });

    res.status(200).json(games);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

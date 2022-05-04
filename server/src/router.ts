// Lib
import { Router } from 'express';
// App
import { gamesRouter } from './games';

export const rootRouter = Router();

rootRouter.use('/games', gamesRouter);

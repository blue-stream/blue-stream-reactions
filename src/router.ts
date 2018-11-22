import { Router } from 'express';
import { ReactionRouter } from './reaction/reaction.router';

const AppRouter: Router = Router();

AppRouter.use('/api/reaction', ReactionRouter);

export { AppRouter };

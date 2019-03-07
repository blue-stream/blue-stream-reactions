import { Router } from 'express';
import { ReactionRouter } from './reaction/reaction.router';
import { HealthRouter } from './utils/health/health.router';

const AppRouter: Router = Router();

AppRouter.use('/api/reaction', ReactionRouter);
AppRouter.use('/health', HealthRouter);

export { AppRouter };

import { Router } from 'express';
import { ReactionValidator } from './validator/reaction.validator';
import { ReactionController } from './reaction.contoller';
import { Wrapper } from '../utils/wrapper';

const ReactionRouter: Router = Router();

ReactionRouter.post('/', ReactionValidator.canCreate, Wrapper.wrapAsync(ReactionController.create));

ReactionRouter.post('/many', ReactionValidator.canCreateMany, Wrapper.wrapAsync(ReactionController.createMany));
ReactionRouter.put('/:id', ReactionValidator.canUpdateById, Wrapper.wrapAsync(ReactionController.updateById));
ReactionRouter.delete('/:id', ReactionValidator.canDeleteById, Wrapper.wrapAsync(ReactionController.deleteById));
ReactionRouter.get('/one', ReactionValidator.canGetOne, Wrapper.wrapAsync(ReactionController.getOne));
ReactionRouter.get('/many', ReactionValidator.canGetMany, Wrapper.wrapAsync(ReactionController.getMany));
ReactionRouter.get('/amount', ReactionValidator.canGetAmount, Wrapper.wrapAsync(ReactionController.getAmount));
ReactionRouter.get('/:id', ReactionValidator.canGetById, Wrapper.wrapAsync(ReactionController.getById));

export { ReactionRouter };

import { Router } from 'express';
import { ReactionValidator } from './validator/reaction.validator';
import { ReactionController } from './reaction.contoller';
import { Wrapper } from '../utils/wrapper';

const ReactionRouter: Router = Router();

ReactionRouter.post('/', ReactionValidator.canCreate, Wrapper.wrapAsync(ReactionController.create));
ReactionRouter.put('/', ReactionValidator.canUpdate, Wrapper.wrapAsync(ReactionController.update));
ReactionRouter.delete('/', ReactionValidator.canDelete, Wrapper.wrapAsync(ReactionController.delete));
ReactionRouter.get('/one', ReactionValidator.canGetOne, Wrapper.wrapAsync(ReactionController.getOne));
ReactionRouter.get('/many', ReactionValidator.canGetMany, Wrapper.wrapAsync(ReactionController.getMany));
ReactionRouter.get('/:resouce/amounts', ReactionValidator.canGetAllTypesAmountsOfResource, Wrapper.wrapAsync(ReactionController.getAllTypesAmountsOfResource));
ReactionRouter.get('/amount', ReactionValidator.canGetAmount, Wrapper.wrapAsync(ReactionController.getAmount));

export { ReactionRouter };

import { Request, Response, NextFunction } from 'express';
import { ReactionValidatons } from './reaction.validations';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';
import { IReaction, ReactionType } from '../reaction.interface';

export class ReactionValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(
            ReactionValidator.validateUser(req.body.user) ||
            ReactionValidator.validateReactionType(req.body.type) ||
            ReactionValidator.validateResource(req.body.resource) ||
            ReactionValidator.validateResourceType(req.body.resourceType),
            );
    }


    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            ReactionValidator.validateId(req.params.id) ||
            ReactionValidator.validateProperty(req.body.reaction.property));
    }

    static canUpdateMany(req: Request, res: Response, next: NextFunction) {
        next(ReactionValidator.validateProperty(req.body.reaction.property));
    }

    static canDeleteById(req: Request, res: Response, next: NextFunction) {
        next(ReactionValidator.validateId(req.params.id));
    }

    static canGetById(req: Request, res: Response, next: NextFunction) {
        next(ReactionValidator.validateId(req.params.id));
    }

    static canGetOne(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetMany(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetAmount(req: Request, res: Response, next: NextFunction) {
        next();
    }

    private static validateResource(id: string) {
        if (!ReactionValidatons.isIdValid(id)) {
            return new IdInvalidError();
        }

        return undefined;
    }

    private static validateReactionType(reactionType: string) {
        if (!ReactionValidatons.isReactionTypeValid(reactionType)) {
            return new ReactionTypeInvalid();
        }

        return undefined;
    }

    private static validateResourceType(reactionType: string) {
        if (!ReactionValidatons.isResourceTypeValid(reactionType)) {
            return new ResourceTypeInvalid();
        }

        return undefined;
    }

    private static validateUser(user: string) {
        if (!ReactionValidatons.isUserValid(user)) {
            return new UserIdInvalidError();
        }

        return undefined;
    }
}

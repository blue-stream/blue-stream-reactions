import { Request, Response, NextFunction } from 'express';
import { ReactionValidatons } from './reaction.validations';
import {
    ReactionTypeInvalidError,
    ResourceInvalidError,
    ResourceTypeInvalidError,
    UserInvalidError,
} from '../../utils/errors/userErrors';
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

    static canUpdate(req: Request, res: Response, next: NextFunction) {
        next(
            ReactionValidator.validateResource(req.query.resource) ||
            ReactionValidator.validateUser(req.query.user) ||
            ReactionValidator.validateReactionType(req.body.type),
        );
    }

    static canDelete(req: Request, res: Response, next: NextFunction) {
        next(
            ReactionValidator.validateResource(req.query.resource) ||
            ReactionValidator.validateUser(req.query.user),
        );
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

    static canGetAllTypesAmountsOfResource(req: Request, res: Response, next: NextFunction) {
        next();
    }

    private static validateResource(id: string) {
        if (!ReactionValidatons.isIdValid(id)) {
            return new ResourceInvalidError();
        }

        return undefined;
    }

    private static validateReactionType(reactionType: string) {
        if (!ReactionValidatons.isReactionTypeValid(reactionType)) {
            return new ReactionTypeInvalidError();
        }

        return undefined;
    }

    private static validateResourceType(reactionType: string) {
        if (!ReactionValidatons.isResourceTypeValid(reactionType)) {
            return new ResourceTypeInvalidError();
        }

        return undefined;
    }

    private static validateUser(user: string) {
        if (!ReactionValidatons.isUserValid(user)) {
            return new UserInvalidError();
        }

        return undefined;
    }
}

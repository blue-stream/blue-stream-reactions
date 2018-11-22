import { Request, Response, NextFunction } from 'express';
import { ReactionValidatons } from './reaction.validations';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';
import { IReaction } from '../reaction.interface';

export class ReactionValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(ReactionValidator.validateProperty(req.body.reaction.property));
    }

    static canCreateMany(req: Request, res: Response, next: NextFunction) {
        const propertiesValidations: (Error | undefined)[] = req.body.reactions.map((reaction: IReaction) => {
            return ReactionValidator.validateProperty(reaction.property);
        });

        next(ReactionValidator.getNextValueFromArray(propertiesValidations));
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

    private static validateProperty(property: string) {
        if (!ReactionValidatons.isPropertyValid(property)) {
            return new PropertyInvalidError();
        }

        return undefined;
    }

    private static validateId(id: string) {
        if (!ReactionValidatons.isIdValid(id)) {
            return new IdInvalidError();
        }

        return undefined;
    }

    private static getNextValueFromArray(validationsArray: (Error | undefined)[]) {
        let nextValue: Error | undefined;

        for (let index = 0; index < validationsArray.length; index++) {
            if (validationsArray[index] !== undefined) {
                nextValue = validationsArray[index];
            }
        }

        return nextValue;
    }
}

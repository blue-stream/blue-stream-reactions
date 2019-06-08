import { Request, Response } from 'express';
import { ReactionManager } from './reaction.manager';

import { ReactionNotFoundError } from '../utils/errors/userErrors';

export class ReactionController {
    static async create(req: Request, res: Response) {
        const reaction = { ...req.body, user: req.user.id };
        res.json(await ReactionManager.create(reaction));
    }

    static async update(req: Request, res: Response) {
        const updated = await ReactionManager.update(
            req.query.resource, req.user.id, req.body.type);
        if (!updated) {
            throw new ReactionNotFoundError();
        }

        res.json(updated);
    }

    static async delete(req: Request, res: Response) {
        const deleted = await ReactionManager.delete(
            req.query.resource, req.user.id);
        if (!deleted) {
            throw new ReactionNotFoundError();
        }

        res.json(deleted);
    }

    static async getOne(req: Request, res: Response) {
        const reaction = await ReactionManager.getOne(req.query.resource, req.query.user);
        if (!reaction) {
            return res.json(null);
        }

        return res.json(reaction);
    }

    static async getMany(req: Request, res: Response) {
        res.json(await ReactionManager.getMany(req.query));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await ReactionManager.getAmount(req.query));
    }

    static async getReactionAmountByTypeAndResourceType(req: Request, res: Response) {
        res.json(await ReactionManager.getReactionAmountByTypeAndResourceType(
            req.query.type,
            req.query.resourceType,
            req.query.startIndex,
            req.query.endIndex,
            req.query.sortBy,
            req.query.sortOrder));
    }

    static async getAllTypesAmountsOfResource(req: Request, res: Response) {
        res.json((await ReactionManager.getAllTypesAmountsOfResource(req.params.resource))[0]);
    }
}

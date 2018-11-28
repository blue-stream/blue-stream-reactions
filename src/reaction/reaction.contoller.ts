import { Request, Response } from 'express';
import { ReactionManager } from './reaction.manager';

import { ReactionNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';

type UpdateResponse = UpdateWriteOpResult['result'];
export class ReactionController {
    static async create(req: Request, res: Response) {
        res.json(await ReactionManager.create(req.body));
    }

    static async update(req: Request, res: Response) {
        const updated = await ReactionManager.update(
            req.query.resource, req.query.user, req.body.type);
        if (!updated) {
            throw new ReactionNotFoundError();
        }

        res.json(updated);
    }

    static async delete(req: Request, res: Response) {
        const deleted = await ReactionManager.delete(
            req.body.resource, req.body.user);
        if (!deleted) {
            throw new ReactionNotFoundError();
        }

        res.json(deleted);
    }

    static async getOne(req: Request, res: Response) {
        const reaction = await ReactionManager.getOne(req.query);
        if (!reaction) {
            throw new ReactionNotFoundError();
        }

        res.json(reaction);
    }

    static async getMany(req: Request, res: Response) {
        res.json(await ReactionManager.getMany(req.query));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await ReactionManager.getAmount(req.query));
    }

    static async getAllTypesAmountsOfResource(req: Request, res: Response) {
        res.json(await ReactionManager.getAllTypesAmountsOfResource(req.query.resource));
    }
}
